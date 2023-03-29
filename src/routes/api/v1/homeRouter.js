/**
 * API version 1 routes.
 */

import express from 'express'
import { router as userRouter } from './userRouter.js'

export const router = express.Router()

/**
 * Resolves a HomeController object from the IoC container.
 *
 * @param {object} req - Express request object.
 * @returns {object} An object that can act as a HomeController object.
 */
const resolveHomeController = (req) => req.app.get('container').resolve('HomeController')

router.get('/', (req, res, next) => resolveHomeController(req).index(req, res, next))

router.use('/users', userRouter)
