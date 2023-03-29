/**
 * Module for bootstrapping.
 */

import { IoCContainer } from '../util/IoCContainer.js'

import { UserModel } from '../models/UserModel.js'
import { UserRepository } from '../repositories/UserRepository.js'
import { UserService } from '../services/UserService.js'
import { LinkProvider } from '../util/LinkProvider.js'
import { InputValidator } from '../util/InputValidator.js'
import { UserController } from '../controllers/UserController.js'
import { HomeController } from '../controllers/HomeController.js'
import { AuthTool } from '../util/AuthTool.js'

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

iocContainer.register('LinkProviderSingleton', LinkProvider, {
  dependencies: null,
  singleton: true
})

iocContainer.register('InputValidatorSingleton', InputValidator, {
  dependencies: null,
  singleton: true
})

iocContainer.register('UserController', UserController, {
  dependencies: [
    'UserServiceSingleton',
    'LinkProviderSingleton',
    'InputValidatorSingleton'
  ]
})

iocContainer.register('HomeController', HomeController, {
  dependencies: null
})

iocContainer.register('AuthTool', AuthTool, {
  dependencies: null
})

export const container = Object.freeze(iocContainer)
