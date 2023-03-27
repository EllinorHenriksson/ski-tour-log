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
   * Authenticates requests and populates req.authenticatedUser with the user resource object.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async authenticateJWT (req, res, next) {
    try {
      const [authenticationScheme, token] = req.headers.authorization?.split(' ')
      if (authenticationScheme !== 'Bearer') {
        throw new Error('Invalid authentication scheme')
      }

      const publicKey = Buffer.from(process.env.PUBLIC_KEY, 'base64')

      const payload = jwt.verify(token, publicKey)

      req.authenticatedUser = await this.#service.getById(payload.sub)

      if (!req.authenticatedUser) {
        throw new Error('User not in database')
      }

      next()
    } catch (err) {
      const error = createError(401, 'JWT invalid or not provided')
      error.cause = err
      next(error)
    }
  }

  /**
   * Authorizes the user, only if she/he is the owner of the resource.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  authorizeUser (req, res, next) {
    if (req.authenticatedUser.id !== req.requestedUser.id) {
      next(createError(403, 'You do not have rights to this resource'))
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
      const collectionURL = new URL(`${req.protocol}://${req.get('host')}${req.baseUrl}`)
      const links = this.#getDocumentLinks(collectionURL, user.id)

      res
        .location(`${collectionURL.href}/${user.id}`)
        .status(201)
        .json({ user, links })
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

      const accessToken = this.#createAccessToken(user)

      const collectionURL = new URL(`${req.protocol}://${req.get('host')}${req.baseUrl}`)
      const links = this.#getLoginLinks(collectionURL, user.id)

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
    const collectionURL = new URL(`${req.protocol}://${req.get('host')}${req.baseUrl}`)

    const links = this.#getDocumentLinks(collectionURL, req.requestedUser.id)

    res.json({ user: req.requestedUser, links })
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
      const collectionURL = new URL(`${req.protocol}://${req.get('host')}${req.baseUrl}`)
      const usersWithLinks = this.#populateWithSelfLink(users, collectionURL)

      res.json({
        users: usersWithLinks,
        links: this.#getCollectionLinks(collectionURL)
      })
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

  #createAccessToken (user) {
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email
    }

    const privateKey = Buffer.from(process.env.PRIVATE_KEY, 'base64')

    return jwt.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: process.env.ACCESS_TOKEN_LIFE
    })
  }

  #populateWithSelfLink (users, collectionURL) {
    const usersWithLinks = []
    for (const user of users) {
      const userObject = user.toObject()
      userObject.links = {
        self: {
          method: 'GET',
          href: `${collectionURL}/${user.id}`
        }
      }
      usersWithLinks.push(userObject)
    }
    return usersWithLinks
  }

  #getDocumentLinks (collectionURL, id) {
    const documentURL = `${collectionURL}/${id}`
    return {
      self: {
        method: 'GET',
        href: documentURL
      },
      update: {
        method: 'PATCH',
        href: documentURL
      },
      replace: {
        method: 'PUT',
        href: documentURL
      },
      tours: {
        method: 'GET',
        href: `${documentURL}/tours`
      },
      createTours: {
        method: 'POST',
        href: `${documentURL}/tours`
      },
      collection: {
        method: 'GET',
        href: collectionURL
      },
      register: {
        method: 'POST',
        href: `${collectionURL}/register`
      },
      login: {
        method: 'POST',
        href: `${collectionURL}/login`
      }
    }
  }

  #getLoginLinks (collectionURL, id) {
    return {
      self: {
        method: 'POST',
        href: `${collectionURL}/login`
      },
      profile: {
        method: 'GET',
        href: `${collectionURL}/${id}`
      },
      collection: {
        method: 'GET',
        href: collectionURL
      },
      register: {
        method: 'POST',
        href: `${collectionURL}/register`
      }
    }
  }

  #getCollectionLinks (collectionURL) {
    // TODO: Paginering! Next och prev!
    return {
      self: {
        method: 'GET',
        href: collectionURL
      },
      next: {
        method: 'GET',
        href: ''
      },
      prev: {
        method: 'GET',
        href: ''
      },
      login: {
        method: 'POST',
        href: `${collectionURL}/login`
      },
      register: {
        method: 'POST',
        href: `${collectionURL}/register`
      }
    }
  }
}
