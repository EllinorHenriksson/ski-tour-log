/**
 * API version 1 routes, auth.
 */

import express from 'express'

export const router = express.Router()

/**
 * Resolves a AuthController object from the IoC container.
 *
 * @param {object} req - Express request object.
 * @returns {object} An object that can act as a AuthController object.
 */
const resolveAuthController = (req) => req.app.get('container').resolve('AuthController')

// POST register
router.post('/resister', (req, res, next) => resolveAuthController(req).register(req, res, next))

// POST login
router.post('/login', (req, res, next) => resolveAuthController(req).login(req, res, next))

// POST logout
router.post('/logout', (req, res, next) => resolveAuthController(req).logout(req, res, next))
