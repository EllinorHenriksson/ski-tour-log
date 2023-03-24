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
}
