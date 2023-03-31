/**
 * API version 1 routes, user.
 */

import express from 'express'
import { router as tourRouter } from './tourRouter.js'
import { router as webhookRouter } from './webhookRouter.js'

export const router = express.Router()

/**
 * Resolves a AuthTool object from the IoC container.
 *
 * @param {object} req - Express request object.
 * @returns {object} An object that can act as a AuthTool object.
 */
const resolveAuthTool = (req) => req.app.get('container').resolve('AuthTool')

/**
 * Resolves a UserController object from the IoC container.
 *
 * @param {object} req - Express request object.
 * @returns {object} An object that can act as a UserController object.
 */
const resolveUserController = (req) => req.app.get('container').resolve('UserController')

// Param loading
router.param('id',
  (req, res, next, id) => resolveUserController(req).loadUser(req, res, next, id)
)

// End points
router.get('/',
  (req, res, next) => resolveAuthTool(req).authenticateJWT(req, res, next),
  (req, res, next) => resolveUserController(req).findAll(req, res, next)
)

router.post('/register', (req, res, next) => resolveUserController(req).register(req, res, next))

router.post('/login', (req, res, next) => resolveUserController(req).login(req, res, next))

router.post('/unregister',
  (req, res, next) => resolveAuthTool(req).authenticateJWT(req, res, next),
  (req, res, next) => resolveUserController(req).unregister(req, res, next)
)

router.get('/:id',
  (req, res, next) => resolveAuthTool(req).authenticateJWT(req, res, next),
  (req, res, next) => resolveUserController(req).find(req, res, next)
)

router.patch('/:id',
  (req, res, next) => resolveAuthTool(req).authenticateJWT(req, res, next),
  (req, res, next) => resolveAuthTool(req).authorizeUser(req, res, next),
  (req, res, next) => resolveUserController(req).partiallyUpdate(req, res, next)
)

router.put('/:id',
  (req, res, next) => resolveAuthTool(req).authenticateJWT(req, res, next),
  (req, res, next) => resolveAuthTool(req).authorizeUser(req, res, next),
  (req, res, next) => resolveUserController(req).update(req, res, next)
)

// Forward routing
router.use('/:id/tour', tourRouter)
router.use('/:id/webhook', webhookRouter)
