/**
 * Module for the UserController.
 */

import createError from 'http-errors'
import { UserService } from '../services/UserService.js'

/**
 * Encapsulates a controller.
 */
export class UserController {
  /**
   * The service.
   *
   * @type {UserService}
   */
  #service

  /**
   * Initializes a new instance.
   *
   * @param {UserService} service - A service instantiated from a class with the same capabilities as UserService.
   */
  constructor (service) {
    this.#service = service
  }

  /**
   * Registers a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async register (req, res, next) {
    try {
      const data = {
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
      }

      const user = await this.#service.insert(data)

      const location = new URL(
        `${req.protocol}://${req.get('host')}${req.baseUrl}/${user._id}`
      )

      res
        .location(location.href)
        .status(201)
        .json({
          ...user,
          links: {
            self: location,
            tours: `${location}/tours`,
            collection: `${req.protocol}://${req.get('host')}${req.baseUrl}`
          }
        })
    } catch (error) {
      let err = error
      if (error.code === 11000) {
        err = createError(409, 'Username and/or email address already registered')
      } else if (error.name === 'ValidationError') {
        err = createError(400, error.message)
      }

      next(err)
    }
  }

  /**
   * Logs in the user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async login (req, res, next) {
    try {
      const user = await User.authenticate(req.body.username, req.body.password)

      // Create JWT.
      const jwtToken = helper.createJwt(user)

      // Create refresh token.
      const refreshToken = helper.createRefreshToken(user, req.ip)
      await refreshToken.save()

      // Set cookie with refresh token.
      helper.setTokenCookie(res, refreshToken.token)

      res
        .json({
          jwt: jwtToken,
          user
        })
    } catch (error) {
      // Authentication failed.
      const err = createError(401, 'Credentials invalid or not provided')
      err.cause = error

      next(err)
    }
  }

  /**
   * Provide req.user to the route if :id is present.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} id - The value of the id for the task to load.
   */
  async loadUser (req, res, next, id) {
    try {
      // Get the user.
      const user = await this.#service.getById(id)

      // If no user found send a 404 (Not Found).
      if (!user) {
        next(createError(404, 'The requested resource was not found.'))
        return
      }

      // Provide the user to req.
      req.user = user

      // Next middleware.
      next()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Logs out the user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async logout (req, res, next) {
    // TODO
  }

  /**
   * Sends a JSON response containing a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async find (req, res, next) {
    res.json(req.user)
  }

  /**
   * Sends a JSON response containing all users.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async findAll (req, res, next) {
    try {
      const users = await this.#service.get()

      res.json(users)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Partially updates a specific task.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async partiallyUpdate (req, res, next) {
    try {
      const partialTask = {}
      if ('description' in req.body) partialTask.description = req.body.description
      if ('done' in req.body) partialTask.done = req.body.done

      await this.#service.update(req.params.id, partialTask)

      res
        .status(204)
        .end()
    } catch (error) {
      const err = createError(error.name === 'ValidationError'
        ? 400 // bad format
        : 500 // something went really wrong
      )
      err.cause = error

      next(err)
    }
  }

  /**
   * Completely updates a specific task.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async update (req, res, next) {
    try {
      const { description, done } = req.body

      await this.#service.replace(req.params.id, { description, done })

      res
        .status(204)
        .end()
    } catch (error) {
      const err = createError(error.name === 'ValidationError'
        ? 400 // bad format
        : 500 // something went really wrong
      )
      err.cause = error

      next(err)
    }
  }
}
