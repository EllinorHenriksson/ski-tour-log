/**
 * API version 1 routes, user.
 */

import express from 'express'

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

// Provide req.user to the route if :id is present in the route path.
router.param('id',
  (req, res, next, id) => resolveUserController(req).loadUser(req, res, next, id)
)

// GET users
// Must be authenticated
router.get('/',
  (req, res, next) => resolveAuthTool(req).authenticateJWT(req, res, next),
  (req, res, next) => resolveUserController(req).findAll(req, res, next)
)

// POST users/register
router.post('/register', (req, res, next) => resolveUserController(req).register(req, res, next))

// POST users/login
router.post('/login', (req, res, next) => resolveUserController(req).login(req, res, next))

// GET users/:id
router.get('/:id',
  (req, res, next) => resolveAuthTool(req).authenticateJWT(req, res, next),
  (req, res, next) => resolveUserController(req).find(req, res, next)
)

// PATCH users/:id
router.patch('/:id',
  (req, res, next) => resolveAuthTool(req).authenticateJWT(req, res, next),
  (req, res, next) => resolveAuthTool(req).authorizeUser(req, res, next),
  (req, res, next) => resolveUserController(req).partiallyUpdate(req, res, next)
)

// PUT users/:id
router.put('/:id',
  (req, res, next) => resolveAuthTool(req).authenticateJWT(req, res, next),
  (req, res, next) => resolveAuthTool(req).authorizeUser(req, res, next),
  (req, res, next) => resolveUserController(req).update(req, res, next)
)
