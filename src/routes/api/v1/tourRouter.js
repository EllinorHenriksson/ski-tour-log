/**
 * API version 1 routes, tour.
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
 * Resolves a TourController object from the IoC container.
 *
 * @param {object} req - Express request object.
 * @returns {object} An object that can act as a TourController object.
 */
const resolveTourController = (req) => req.app.get('container').resolve('TourController')

// Param loading
router.param('id',
  (req, res, next, id) => resolveTourController(req).loadTour(req, res, next, id)
)

// End points
router.get('/',
  (req, res, next) => resolveAuthTool(req).authenticateJWT(req, res, next),
  (req, res, next) => resolveTourController(req).findAll(req, res, next)
)

router.post('/', (req, res, next) => resolveTourController(req).create(req, res, next))

router.get('/:id',
  (req, res, next) => resolveAuthTool(req).authenticateJWT(req, res, next),
  (req, res, next) => resolveTourController(req).find(req, res, next)
)

router.patch('/:id',
  (req, res, next) => resolveAuthTool(req).authenticateJWT(req, res, next),
  (req, res, next) => resolveAuthTool(req).authorizeUser(req, res, next),
  (req, res, next) => resolveTourController(req).partiallyUpdate(req, res, next)
)

router.put('/:id',
  (req, res, next) => resolveAuthTool(req).authenticateJWT(req, res, next),
  (req, res, next) => resolveAuthTool(req).authorizeUser(req, res, next),
  (req, res, next) => resolveTourController(req).update(req, res, next)
)

router.delete('/:id',
  (req, res, next) => resolveAuthTool(req).authenticateJWT(req, res, next),
  (req, res, next) => resolveAuthTool(req).authorizeUser(req, res, next),
  (req, res, next) => resolveTourController(req).delete(req, res, next)
)
