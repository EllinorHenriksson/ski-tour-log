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
}
