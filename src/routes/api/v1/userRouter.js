/**
 * API version 1 routes, user.
 */

import express from 'express'

export const router = express.Router()

/**
 * Resolves a UserController object from the IoC container.
 *
 * @param {object} req - Express request object.
 * @returns {object} An object that can act as a UserController object.
 */
const resolveUserController = (req) => req.app.get('container').resolve('UserController')

// Provide req.user to the route if :id is present in the route path.
router.param('id', (req, res, next, id) => resolveUserController(req).loadUser(req, res, next, id))

// GET users
router.get('/', (req, res, next) => resolveUserController(req).findAll(req, res, next))

// GET users/:id
router.get('/:id', (req, res, next) => resolveUserController(req).find(req, res, next))

// PATCH users/:id
router.patch('/:id', (req, res, next) => resolveUserController(req).partiallyUpdate(req, res, next))

// PUT users/:id
router.put('/:id', (req, res, next) => resolveUserController(req).update(req, res, next))
