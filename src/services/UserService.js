/**
 * Module for the UserService.
 */

import { MongooseServiceBase } from './MongooseServiceBase.js'
import { UserRepository } from '../repositories/UserRepository.js'
import jwt from 'jsonwebtoken'

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

  async authenticate (username, password) {
    return this._repository.authenticate(username, password)
  }

  async authenticateJWT (authHeader) {
    if (!authHeader) {
      throw new Error('No authorizaton header')
    }

    const [authenticationScheme, token] = authHeader.split(' ')

    if (authenticationScheme !== 'Bearer') {
      throw new Error('Invalid authentication scheme')
    }

    const publicKey = Buffer.from(process.env.PUBLIC_KEY, 'base64')

    const payload = jwt.verify(token, publicKey)

    return this.getById(payload.sub)
  }
}
