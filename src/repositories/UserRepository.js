/**
 * Module for UserRepository.
 */

import { MongooseRepositoryBase } from './MongooseRepositoryBase.js'
import { UserModel } from '../models/UserModel.js'

/**
 * Encapsulates a user repository.
 */
export class UserRepository extends MongooseRepositoryBase {
  /**
   * Initializes a new instance.
   *
   * @param {UserModel} [model=UserModel] - A class with the same capabilities as UserModel.
   */
  constructor (model = UserModel) {
    super(model)
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
    return this._model.authenticate(username, password)
  }
}
