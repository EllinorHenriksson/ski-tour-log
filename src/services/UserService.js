/**
 * Module for the UserService.
 */

import { MongooseServiceBase } from './MongooseServiceBase.js'
import { UserRepository } from '../repositories/UserRepository.js'

/**
 * Encapsulates a user service.
 */
export class UserService extends MongooseServiceBase {
  /**
   * Initializes a new instance.
   *
   * @param {UserRepository} [repository = new UserRepository()] - A repository instantiated from a class with the same capabilities as UserRepository.
   */
  constructor (repository = new UserRepository()) {
    super(repository)
  }

  /**
   * Authenticates user credentials.
   *
   * @param {string} username - The username.
   * @param {string} password - The password.
   * @throws {Error} If the credentials are incorrect.
   * @returns {Promise<object>} Promise resolved with the authenticated user.
   */
  async authenticate (username, password) {
    return this._repository.authenticate(username, password)
  }
}
