/**
 * Module for the AuthController.
 */

import createError from 'http-errors'
import { UserService } from '../services/UserService.js'

/**
 * Encapsulates a controller.
 */
export class AuthController {
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
    // TODO
  }

  /**
   * Logs in the user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async login (req, res, next) {
    // TODO
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
}
