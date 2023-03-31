/**
 * Module for the WebhookController.
 */

import createError from 'http-errors'
import { WebhookService } from '../services/WebhookService.js'
import { InputValidator } from '../util/InputValidator.js'
import { NonUserLinkProvider } from '../util/linkProviders/NonUserLinkProvider.js'
import fetch from 'node-fetch'

/**
 * Encapsulates a controller.
 */
export class WebhookController {
  /**
   * The service.
   *
   * @type {WebhookService}
   */
  #service

  /**
   * A link provider.
   *
   * @type {NonUserLinkProvider}
   */
  #linkProvider

  /**
   * An input validator.
   *
   * @type {InputValidator}
   */
  #inputValidator

  /**
   * Initializes a new instance.
   *
   * @param {WebhookService} service - A service instantiated from a class with the same capabilities as WebhookService.
   * @param {NonUserLinkProvider} linkProvider - A non user link provider.
   * @param {InputValidator} inputValidator - An input validator.
   */
  constructor (service, linkProvider, inputValidator) {
    this.#service = service
    this.#linkProvider = linkProvider
    this.#inputValidator = inputValidator
  }

  async fireWebhooks (event, action, attributes) {
    let webhooks
    if (event === 'user') {
      webhooks = await this.#service.get({ user: true }, ['endpoint'])
    } else if (event === 'tour') {
      webhooks = await this.#service.get({ tour: true }, ['endpoint'])
    }

    const promises = []
    for (const webhook of webhooks) {
      const promise = fetch(webhook.endpoint, {
        method: 'POST',
        headers: {
          'X-Skitourlog-Token': webhook.token,
          'Content-Type': 'application/json'
        },
        body: {
          event,
          action,
          attributes
        }
      })
      promises.push(promise)
    }

    return Promise.all(promises)
  }

  /**
   * Provide req.requestedWebhook to the route if :id is present.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} id - The value of the id for the webhook to load.
   */
  async loadWebhook (req, res, next, id) {
    try {
      const webhooks = await this.#service.get({ _id: id, owner: req.requestedUser.id })

      if (webhooks.length === 0) {
        next(createError(404, 'The requested resource was not found.'))
        return
      }

      req.requestedWebhook = webhooks[0]

      next()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Sends a JSON response containing a webhook.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async find (req, res, next) {
    const collectionURL = this.#getCollectionURL(req)

    res.json({
      webhook: {
        data: req.requestedWebhook,
        links: this.#linkProvider.getDocumentLinks(`${collectionURL}/${req.requestedWebhook.id}`, true, true)
      },
      links: this.#linkProvider.getFindLinks(collectionURL, req.requestedUser)
    })
  }

  /**
   * Sends a JSON response containing all webhooks.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async findAll (req, res, next) {
    try {
      let pageSize = 10
      let pageStartIndex = 0

      if (req.query['page-size']) {
        this.#inputValidator.validatePageSize(req.query['page-size'])
        pageSize = parseInt(req.query['page-size'])
      }

      if (req.query['page-start-index']) {
        this.#inputValidator.validatePageStartIndex(req.query['page-start-index'])
        pageStartIndex = parseInt(req.query['page-start-index'])
      }

      const webhooks = await this.#service.get({ owner: req.requestedUser.id }, null, { limit: pageSize, skip: pageStartIndex })

      const count = await this.#service.getCount()
      const collectionURL = this.#getCollectionURL(req)

      res.json({
        webhooks: this.#linkProvider.populateWithLinks(webhooks, collectionURL),
        links: this.#linkProvider.getCollectionLinks(collectionURL, { pageSize, pageStartIndex, count }, req.authenticatedUser?.sub === req.requestedUser.id)
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Creates a webhook.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async create (req, res, next) {
    try {
      const data = {
        endpoint: req.body.endpoint,
        token: req.body.token,
        user: req.body.user,
        tour: req.body.tour,
        owner: req.requestedUser.id
      }

      const webhook = await this.#service.insert(data)
      const collectionURL = this.#getCollectionURL(req)

      res
        .location(`${collectionURL.href}/${webhook.id}`)
        .status(201)
        .json({
          webhook: {
            data: webhook,
            links: this.#linkProvider.getDocumentLinks(`${collectionURL}/${webhook.id}`, true, true)
          },
          links: this.#linkProvider.getCreateLinks(collectionURL)
        })
    } catch (error) {
      let err = error
      if (error.name === 'ValidationError') {
        err = createError(400, error.message)
      }

      next(err)
    }
  }

  /**
   * Partially updates a specific webhook.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async partiallyUpdate (req, res, next) {
    try {
      const partialWebhook = {}
      if ('endpoint' in req.body) partialWebhook.endpoint = req.body.endpoint
      if ('token' in req.body) partialWebhook.token = req.body.token
      if ('user' in req.body) partialWebhook.user = req.body.user
      if ('tour' in req.body) partialWebhook.tour = req.body.tour

      const webhook = await this.#service.update(req.requestedWebhook.id, partialWebhook)
      const collectionURL = this.#getCollectionURL(req)

      res.json({
        webhook: {
          data: webhook,
          links: this.#linkProvider.getDocumentLinks(`${collectionURL}/${webhook.id}`, true, true)
        },
        links: this.#linkProvider.getPatchLinks(collectionURL, webhook.id)
      })
    } catch (error) {
      let err = error
      if (error.name === 'ValidationError') {
        err = createError(400, error.message)
      }

      next(err)
    }
  }

  /**
   * Completely updates a specific webhook.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async update (req, res, next) {
    try {
      const { endpoint, token, user, tour } = req.body

      const webhook = await this.#service.replace(req.requestedWebhook.id, { endpoint, token, user, tour, owner: req.requestedUser.id })

      const collectionURL = this.#getCollectionURL(req)

      res.json({
        webhook: {
          data: webhook,
          links: this.#linkProvider.getDocumentLinks(`${collectionURL}/${webhook.id}`, true, true)
        },
        links: this.#linkProvider.getPutLinks(collectionURL, webhook.id)
      })
    } catch (error) {
      let err = error
      if (error.name === 'ValidationError') {
        err = createError(400, error.message)
      }

      next(err)
    }
  }

  /**
   * Deletes a specific webhook.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async delete (req, res, next) {
    try {
      await this.#service.delete(req.requestedWebhook.id)

      const collectionURL = this.#getCollectionURL(req)
      const links = this.#linkProvider.getDeleteLinks(collectionURL, req.requestedWebhook.id)

      res.json({ links })
    } catch (error) {
      next(error)
    }
  }

  #getCollectionURL (req) {
    return new URL(`${req.protocol}://${req.get('host')}${req.baseUrl}`)
  }
}
