/**
 * API version 1 routes.
 */

import express from 'express'
import { router as authRouter } from './authRouter.js'
import { router as userRouter } from './userRouter.js'

export const router = express.Router()

router.use('/auth', authRouter)
router.use('/users', userRouter)
