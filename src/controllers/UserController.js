/**
 * Module for the UserController.
 */

import createError from 'http-errors'
import { UserService } from '../services/UserService.js'
import { InputValidator } from '../util/InputValidator.js'
import { UserLinkProvider } from '../util/linkProviders/UserLinkProvider.js'
import { TourService } from '../services/TourService.js'
import { WebhookService } from '../services/WebhookService.js'

import jwt from 'jsonwebtoken'

/**
 * Encapsulates a controller.
 */
export class UserController {
  /**
   * A user service.
   *
   * @type {UserService}
   */
  #userService

  /**
   * A tour service.
   *
   * @type {TourService}
   */
  #tourService

  /**
   * A webhook service.
   *
   * @type {WebhookService}
   */
  #webhookService

  /**
   * A link provider.
   *
   * @type {UserLinkProvider}
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
   * @param {UserService} userService - A service instantiated from a class with the same capabilities as UserService.
   * @param {TourService} tourService - A service instantiated from a class with the same capabilities as TourService.
   * @param {WebhookService} webhookService - A service instantiated from a class with the same capabilities as WebhookService.
   * @param {UserLinkProvider} linkProvider - A user link provider.
   * @param {InputValidator} inputValidator - An input validator.
   */
  constructor (userService, tourService, webhookService, linkProvider, inputValidator) {
    this.#userService = userService
    this.#tourService = tourService
    this.#webhookService = webhookService
    this.#linkProvider = linkProvider
    this.#inputValidator = inputValidator
  }

  /**
   * Provide req.requestedUser to the route if :id is present.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} id - The value of the id for the user to load.
   */
  async loadUser (req, res, next, id) {
    try {
      const user = await this.#userService.getById(id)

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
        password: req.body.password
      }

      const user = await this.#userService.insert(data)
      await this.#webhookService.trigger('user', 'register', user)

      const collectionURL = this.#getCollectionURL(req)

      res
        .location(`${collectionURL.href}/${user.id}`)
        .status(201)
        .json({
          user: {
            data: user,
            links: this.#linkProvider.getDocumentLinks(`${collectionURL}/${user.id}`, false, false)
          },
          links: this.#linkProvider.getRegisterLinks(collectionURL)
        })
    } catch (error) {
      let err = error
      if (error.code === 11000) {
        err = createError(409, 'Username already registered')
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
      const user = await this.#userService.authenticate(req.body.username, req.body.password)

      const payload = {
        sub: user.id,
        username: user.username
      }

      const privateKey = Buffer.from(process.env.PRIVATE_KEY, 'base64')

      const accessToken = jwt.sign(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn: process.env.ACCESS_TOKEN_LIFE
      })

      const collectionURL = this.#getCollectionURL(req)
      const links = this.#linkProvider.getLoginLinks(collectionURL, user.id)

      res.json({ accessToken, links })
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

    res.json({
      user: {
        data: req.requestedUser,
        links: this.#linkProvider.getDocumentLinks(`${collectionURL}/${req.requestedUser.id}`, true, req.authenticatedUser?.sub === req.requestedUser.id)
      },
      links: this.#linkProvider.getFindLinks(collectionURL, req.requestedUser.id)
    })
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

      if (req.query['page-size']) {
        this.#inputValidator.validatePageSize(req.query['page-size'])
        pageSize = parseInt(req.query['page-size'])
      }

      if (req.query['page-start-index']) {
        this.#inputValidator.validatePageStartIndex(req.query['page-start-index'])
        pageStartIndex = parseInt(req.query['page-start-index'])
      }

      const users = await this.#userService.get(null, null, { limit: pageSize, skip: pageStartIndex })

      const count = await this.#userService.getCount()

      const collectionURL = this.#getCollectionURL(req)

      res.json({
        users: this.#linkProvider.populateWithLinks(users, collectionURL),
        links: this.#linkProvider.getCollectionLinks(collectionURL, { pageSize, pageStartIndex, count })
      })
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
      if ('password' in req.body) partialUser.password = req.body.password

      const user = await this.#userService.update(req.requestedUser.id, partialUser)

      this.#webhookService.trigger('user', 'update', user)

      const collectionURL = this.#getCollectionURL(req)

      res
        .json({
          user: {
            data: user,
            links: this.#linkProvider.getDocumentLinks(`${collectionURL}/${user.id}`, true, true)
          },
          links: this.#linkProvider.getPatchLinks(collectionURL, user.id)
        })
    } catch (error) {
      let err = error
      if (error.code === 11000) {
        err = createError(409, 'Username already registered')
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
      const { username, password } = req.body

      const user = await this.#userService.replace(req.requestedUser.id, { username, password })

      await this.#webhookService.trigger('user', 'update', user)

      const collectionURL = this.#getCollectionURL(req)

      res.json({
        user: {
          data: user,
          links: this.#linkProvider.getDocumentLinks(`${collectionURL}/${user.id}`, true, true)
        },
        links: this.#linkProvider.getPutLinks(collectionURL, user.id)
      })
    } catch (error) {
      let err = error
      if (error.code === 11000) {
        err = createError(409, 'Username already registered')
      } else if (error.name === 'ValidationError') {
        err = createError(400, error.message)
      }

      next(err)
    }
  }

  /**
   * Unregisters the user, removing all related data.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async unregister (req, res, next) {
    try {
      await this.#tourService.deleteMany({ owner: req.authenticatedUser.sub })
      await this.#webhookService.deleteMany({ owner: req.authenticatedUser.sub })
      await this.#userService.delete(req.authenticatedUser.sub)

      const collectionURL = this.#getCollectionURL(req)
      const links = this.#linkProvider.getDeleteLinks(collectionURL, req.authenticatedUser.sub)

      res.json({ links })
    } catch (error) {
      next(error)
    }
  }

  #getCollectionURL (req) {
    return new URL(`${req.protocol}://${req.get('host')}${req.baseUrl}`)
  }
}
