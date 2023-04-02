/**
 * Module for the TourController.
 */

import createError from 'http-errors'
import { TourService } from '../services/TourService.js'
import { InputValidator } from '../util/InputValidator.js'
import { NonUserLinkProvider } from '../util/linkProviders/NonUserLinkProvider.js'
import { WebhookService } from '../services/WebhookService.js'

/**
 * Encapsulates a controller.
 */
export class TourController {
  /**
   * A tour service.
   *
   * @type {TourService}
   */
  #tourService

  /**
   * A webhook service.
   *
   * @type {WebhookService}
   */
  #webhookService

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
   * @param {TourService} tourService - A tour service.
   * @param {WebhookService} webhookService - A webhook service.
   * @param {NonUserLinkProvider} linkProvider - A non user link provider.
   * @param {InputValidator} inputValidator - An input validator.
   */
  constructor (tourService, webhookService, linkProvider, inputValidator) {
    this.#tourService = tourService
    this.#webhookService = webhookService
    this.#linkProvider = linkProvider
    this.#inputValidator = inputValidator
  }

  /**
   * Provide req.requestedTour to the route if :id is present.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} id - The value of the id for the tour to load.
   */
  async loadTour (req, res, next, id) {
    try {
      const tours = await this.#tourService.get({ _id: id, owner: req.requestedUser.id })

      if (tours.length === 0) {
        next(createError(404, 'The requested tour was not found.'))
        return
      }

      req.requestedTour = tours[0]

      next()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Sends a JSON response containing a tour.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async find (req, res, next) {
    const collectionURL = `${req.protocol}://${req.get('host')}${req.baseUrl}`

    res.json({
      tour: {
        data: req.requestedTour,
        links: this.#linkProvider.getDocumentLinks(`${collectionURL}/${req.requestedTour.id}`, true, req.authenticatedUser?.sub === req.requestedUser.id)
      },
      links: this.#linkProvider.getFindLinks(collectionURL, req.requestedUser.id)
    })
  }

  /**
   * Sends a JSON response containing all tours.
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

      const tours = await this.#tourService.get({ owner: req.requestedUser.id }, null, { limit: pageSize, skip: pageStartIndex })

      const count = await this.#tourService.getCount()
      const collectionURL = `${req.protocol}://${req.get('host')}${req.baseUrl}`

      res.json({
        tours: this.#linkProvider.populateWithLinks(tours, collectionURL),
        links: this.#linkProvider.getCollectionLinks(collectionURL, { pageSize, pageStartIndex, count }, req.authenticatedUser?.sub === req.requestedUser.id)
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Creates a tour.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async create (req, res, next) {
    try {
      const data = {
        date: req.body.date,
        duration: req.body.duration,
        distance: req.body.distance,
        temperature: req.body.temperature,
        wax: req.body.wax,
        glide: req.body.glide,
        grip: req.body.grip,
        description: req.body.description,
        owner: req.requestedUser.id
      }

      const tour = await this.#tourService.insert(data)

      await this.#webhookService.trigger('tour', 'create', tour)

      const collectionURL = `${req.protocol}://${req.get('host')}${req.baseUrl}`

      res
        .location(`${collectionURL}/${tour.id}`)
        .status(201)
        .json({
          tour: {
            data: tour,
            links: this.#linkProvider.getDocumentLinks(`${collectionURL}/${tour.id}`, true, true)
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
   * Partially updates a specific tour.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async partiallyUpdate (req, res, next) {
    try {
      const partialTour = {}
      if ('date' in req.body) partialTour.date = req.body.date
      if ('duration' in req.body) partialTour.duration = req.body.duration
      if ('distance' in req.body) partialTour.distance = req.body.distance
      if ('temperature' in req.body) partialTour.temperature = req.body.temperature
      if ('wax' in req.body) partialTour.wax = req.body.wax
      if ('glide' in req.body) partialTour.glide = req.body.glide
      if ('grip' in req.body) partialTour.grip = req.body.grip
      if ('description' in req.body) partialTour.description = req.body.description

      const tour = await this.#tourService.update(req.requestedTour.id, partialTour)

      await this.#webhookService.trigger('tour', 'update', tour)

      const collectionURL = `${req.protocol}://${req.get('host')}${req.baseUrl}`

      res.json({
        tour: {
          data: tour,
          links: this.#linkProvider.getDocumentLinks(`${collectionURL}/${tour.id}`, true, true)
        },
        links: this.#linkProvider.getPatchLinks(collectionURL, tour.id)
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
   * Completely updates a specific tour.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async update (req, res, next) {
    try {
      const { date, duration, distance, temperature, wax, glide, grip, description } = req.body

      const tour = await this.#tourService.replace(req.requestedTour.id, { date, duration, distance, temperature, wax, glide, grip, description, owner: req.requestedUser.id })

      await this.#webhookService.trigger('tour', 'update', tour)

      const collectionURL = `${req.protocol}://${req.get('host')}${req.baseUrl}`

      res.json({
        tour: {
          data: tour,
          links: this.#linkProvider.getDocumentLinks(`${collectionURL}/${tour.id}`, true, true)
        },
        links: this.#linkProvider.getPutLinks(collectionURL, tour.id)
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
   * Deletes a specific tour.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async delete (req, res, next) {
    try {
      const tour = await this.#tourService.delete(req.requestedTour.id)

      await this.#webhookService.trigger('tour', 'delete', tour)

      const collectionURL = `${req.protocol}://${req.get('host')}${req.baseUrl}`
      const links = this.#linkProvider.getDeleteLinks(collectionURL, req.requestedTour.id)

      res.json({ links })
    } catch (error) {
      next(error)
    }
  }
}
