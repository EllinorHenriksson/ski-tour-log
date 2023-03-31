/**
 * API version 1 routes, webhook.
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
 * Resolves a WebhookController object from the IoC container.
 *
 * @param {object} req - Express request object.
 * @returns {object} An object that can act as a WebhookController object.
 */
const resolveWebhookController = (req) => req.app.get('container').resolve('WebhookController')

// Param loading
router.param('id',
  (req, res, next, id) => resolveWebhookController(req).loadWebhook(req, res, next, id)
)

// End points
router.get('/',
  (req, res, next) => resolveAuthTool(req).authenticateJWT(req, res, next),
  (req, res, next) => resolveAuthTool(req).authorizeUser(req, res, next),
  (req, res, next) => resolveWebhookController(req).findAll(req, res, next)
)

router.post('/',
  (req, res, next) => resolveAuthTool(req).authenticateJWT(req, res, next),
  (req, res, next) => resolveAuthTool(req).authorizeUser(req, res, next),
  (req, res, next) => resolveWebhookController(req).create(req, res, next)
)

router.get('/:id',
  (req, res, next) => resolveAuthTool(req).authenticateJWT(req, res, next),
  (req, res, next) => resolveAuthTool(req).authorizeUser(req, res, next),
  (req, res, next) => resolveWebhookController(req).find(req, res, next)
)

router.patch('/:id',
  (req, res, next) => resolveAuthTool(req).authenticateJWT(req, res, next),
  (req, res, next) => resolveAuthTool(req).authorizeUser(req, res, next),
  (req, res, next) => resolveWebhookController(req).partiallyUpdate(req, res, next)
)

router.put('/:id',
  (req, res, next) => resolveAuthTool(req).authenticateJWT(req, res, next),
  (req, res, next) => resolveAuthTool(req).authorizeUser(req, res, next),
  (req, res, next) => resolveWebhookController(req).update(req, res, next)
)

router.delete('/:id',
  (req, res, next) => resolveAuthTool(req).authenticateJWT(req, res, next),
  (req, res, next) => resolveAuthTool(req).authorizeUser(req, res, next),
  (req, res, next) => resolveWebhookController(req).delete(req, res, next)
)
