/**
 * Module for bootstrapping.
 */

// OBS! Ändra denna så den passar applikationen

import { IoCContainer } from '../util/IoCContainer.js'

import { UserModel } from '../models/UserModel.js'
import { UserRepository } from '../repositories/UserRepository.js'
import { UserService } from '../services/UserService.js'

import { AuthController } from '../controllers/AuthController.js'
import { UserController } from '../controllers/UserController.js'

const iocContainer = new IoCContainer()

iocContainer.register('ConnectionString', process.env.DB_CONNECTION_STRING)

iocContainer.register('UserModelType', UserModel, { type: true })

iocContainer.register('UserRepositorySingleton', UserRepository, {
  dependencies: [
    'UserModelType'
  ],
  singleton: true
})

iocContainer.register('UserServiceSingleton', UserService, {
  dependencies: [
    'UserRepositorySingleton'
  ],
  singleton: true
})

iocContainer.register('UserController', UserController, {
  dependencies: [
    'UserServiceSingleton'
  ]
})

iocContainer.register('AuthController', AuthController, {
  dependencies: [
    'AuthServiceSingleton'
  ]
})

export const container = Object.freeze(iocContainer)
