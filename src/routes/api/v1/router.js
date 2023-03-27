/**
 * API version 1 routes.
 */

import express from 'express'
import { router as userRouter } from './userRouter.js'

export const router = express.Router()

router.use('/user', userRouter)
