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

  createJWT (user) {
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
}
