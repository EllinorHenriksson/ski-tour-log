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
