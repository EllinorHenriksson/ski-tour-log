/**
 * Module for the UserController.
 */

import createError from 'http-errors'
import { UserService } from '../services/UserService.js'
import { InputValidator } from '../util/InputValidator.js'
import { LinkProvider } from '../util/LinkProvider.js'

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
   * A link provider.
   *
   * @type {LinkProvider}
   */
  #linkProvider

  /**
   * An input validator.
   *
   * @type {InputValidator}
   */
  #inputValidator

  /**
   * Initializes a new instance.
   *
   * @param {UserService} service - A service instantiated from a class with the same capabilities as UserService.
   * @param {LinkProvider} linkProvider - A link provider.
   * @param {InputValidator} inputValidator - An input validator.
   */
  constructor (service, linkProvider, inputValidator) {
    this.#service = service
    this.#linkProvider = linkProvider
    this.#inputValidator = inputValidator
  }

  /**
   * Provide req.requestedUser to the route if :id is present.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} id - The value of the id for the task to load.
   */
  async loadUser (req, res, next, id) {
    try {
      const user = await this.#service.getById(id)

      if (!user) {
        next(createError(404, 'The requested resource was not found.'))
        return
      }

      req.requestedUser = user

      next()
    } catch (error) {
      next(error)
    }
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

      const user = await this.#service.insert(data)

      const collectionURL = this.#getCollectionURL(req)

      const links = this.#linkProvider.getRegisterLinks(collectionURL, user.id)

      res
        .location(`${collectionURL.href}/${user.id}`)
        .status(201)
        .json({ data: user, links })
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
      const user = await this.#service.authenticate(req.body.username, req.body.password)

      const jwt = this.#service.createJWT(user)

      const collectionURL = this.#getCollectionURL(req)
      const links = this.#linkProvider.getDocumentLinks(collectionURL, user.id, true)

      res.json({ jwt, links })
    } catch (error) {
      const err = createError(401, 'Credentials invalid or not provided')
      err.cause = error

      next(err)
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
    const collectionURL = this.#getCollectionURL(req)

    const links = this.#linkProvider.getDocumentLinks(collectionURL, req.requestedUser.id, req.authenticatedUser?.sub === req.requestedUser.id)

    res.json({ data: req.requestedUser, links })
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
      let pageSize = 10
      let pageStartIndex = 0

      if (req.query.pageSize) {
        this.#inputValidator.validatePageSize(req.query.pageSize)
        pageSize = parseInt(req.query.pageSize)
      }

      if (req.query.pageStartIndex) {
        this.#inputValidator.validatePageStartIndex(req.query.pageStartIndex)
        pageStartIndex = parseInt(req.query.pageStartIndex)
      }

      const users = await this.#service.get(null, null, { limit: pageSize, skip: pageStartIndex })

      const count = await this.#service.getCount()

      const collectionURL = this.#getCollectionURL(req)
      const links = this.#linkProvider.getCollectionLinks(collectionURL, { pageSize, pageStartIndex, count })

      res.json({ data: users, links })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Partially updates a specific user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async partiallyUpdate (req, res, next) {
    try {
      const partialUser = {}
      if ('username' in req.body) partialUser.username = req.body.username
      if ('email' in req.body) partialUser.email = req.body.email
      if ('password' in req.body) partialUser.password = req.body.password

      const user = await this.#service.update(req.requestedUser.id, partialUser)

      const collectionURL = this.#getCollectionURL(req)
      const links = this.#linkProvider.getDocumentLinks(collectionURL, user.id, true)

      res
        .json({ data: user, links })
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
   * Completely updates a specific user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async update (req, res, next) {
    try {
      const { username, email, password } = req.body

      const user = await this.#service.replace(req.requestedUser.id, { username, email, password })

      const collectionURL = this.#getCollectionURL(req)
      const links = this.#linkProvider.getDocumentLinks(collectionURL, user.id, true)

      res.json({ data: user, links })
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

  #getCollectionURL (req) {
    return new URL(`${req.protocol}://${req.get('host')}${req.baseUrl}`)
  }
}
