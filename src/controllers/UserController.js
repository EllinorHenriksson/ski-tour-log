/**
 * Module for the UserController.
 */

import createError from 'http-errors'
import { UserService } from '../services/UserService.js'
import jwt from 'jsonwebtoken'

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
        email: req.body.email
      }

      let user = await this.#service.insert(data)

      const location = new URL(
        `${req.protocol}://${req.get('host')}${req.baseUrl}/${user._id}`
      )

      user = user.toObject()
      user.links = {
        self: {
          method: 'GET',
          href: location
        },
        update: {
          method: 'PATCH',
          href: location
        },
        replace: {
          method: 'PUT',
          href: location
        },
        tours: {
          method: 'GET',
          href: `${location}/tour`
        },
        createTours: {
          method: 'POST',
          href: `${location}/tour`
        }
      }

      res
        .location(location.href)
        .status(201)
        .json({
          user,
          links: {
            collection: {
              method: 'GET',
              href: `${req.protocol}://${req.get('host')}${req.baseUrl}`
            },
            register: {
              method: 'POST',
              href: `${req.protocol}://${req.get('host')}${req.baseUrl}/register`
            },
            login: {
              method: 'POST',
              href: `${req.protocol}://${req.get('host')}${req.baseUrl}/login`
            }
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
      let user = await this.#service.authenticate(req.body.username, req.body.password)

      const payload = {
        sub: user.username,
        email: user.email
      }

      const privateKey = Buffer.from(process.env.PRIVATE_KEY, 'base64')

      // Create access token.
      const accessToken = jwt.sign(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn: process.env.ACCESS_TOKEN_LIFE
      })

      const location = new URL(
        `${req.protocol}://${req.get('host')}${req.baseUrl}/${user._id}`
      )

      user = user.toObject()
      user.links = {
        self: {
          method: 'GET',
          href: location
        },
        update: {
          method: 'PATCH',
          href: location
        },
        replace: {
          method: 'PUT',
          href: location
        },
        tours: {
          method: 'GET',
          href: `${location}/tour`
        },
        createTours: {
          method: 'POST',
          href: `${location}/tour`
        }
      }

      res
        .json({
          accessToken,
          user,
          links: {
            collection: {
              method: 'GET',
              href: `${req.protocol}://${req.get('host')}${req.baseUrl}`
            },
            register: {
              method: 'POST',
              href: `${req.protocol}://${req.get('host')}${req.baseUrl}/register`
            },
            login: {
              method: 'POST',
              href: `${req.protocol}://${req.get('host')}${req.baseUrl}/login`
            }
          }
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
