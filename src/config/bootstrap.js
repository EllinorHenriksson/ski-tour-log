/**
 * Module for bootstrapping.
 */

import { IoCContainer } from '../util/IoCContainer.js'

import { HomeController } from '../controllers/HomeController.js'

import { AuthTool } from '../util/AuthTool.js'

import { LinkProvider } from '../util/LinkProvider.js'
import { InputValidator } from '../util/InputValidator.js'

import { UserModel } from '../models/UserModel.js'
import { UserRepository } from '../repositories/UserRepository.js'
import { UserService } from '../services/UserService.js'
import { UserController } from '../controllers/UserController.js'

import { TourModel } from '../models/TourModel.js'
import { TourRepository } from '../repositories/TourRepository.js'
import { TourService } from '../services/TourService.js'
import { TourController } from '../controllers/TourController.js'

const iocContainer = new IoCContainer()

iocContainer.register('ConnectionString', process.env.DB_CONNECTION_STRING)

iocContainer.register('HomeController', HomeController, {
  dependencies: null
})

iocContainer.register('AuthTool', AuthTool, {
  dependencies: null
})

iocContainer.register('LinkProviderSingleton', LinkProvider, {
  dependencies: null,
  singleton: true
})

iocContainer.register('InputValidatorSingleton', InputValidator, {
  dependencies: null,
  singleton: true
})

// User
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
    'UserServiceSingleton',
    'LinkProviderSingleton',
    'InputValidatorSingleton'
  ]
})

// Tour
iocContainer.register('TourModelType', TourModel, { type: true })

iocContainer.register('TourRepositorySingleton', TourRepository, {
  dependencies: [
    'TourModelType'
  ],
  singleton: true
})

iocContainer.register('TourServiceSingleton', TourService, {
  dependencies: [
    'TourRepositorySingleton'
  ],
  singleton: true
})

iocContainer.register('TourController', TourController, {
  dependencies: [
    'TourServiceSingleton',
    'LinkProviderSingleton',
    'InputValidatorSingleton'
  ]
})

export const container = Object.freeze(iocContainer)
