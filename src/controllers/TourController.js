/**
 * Module for the TourController.
 */

import createError from 'http-errors'
import { TourService } from '../services/TourService.js'
import { InputValidator } from '../util/InputValidator.js'
import { TourLinkProvider } from '../util/linkProviders/TourLinkProvider.js'
/**
 * Encapsulates a controller.
 */
export class TourController {
  /**
   * The service.
   *
   * @type {TourService}
   */
  #service

  /**
   * A link provider.
   *
   * @type {TourLinkProvider}
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
   * @param {TourService} service - A service instantiated from a class with the same capabilities as TourService.
   * @param {TourLinkProvider} linkProvider - A tour link provider.
   * @param {InputValidator} inputValidator - An input validator.
   */
  constructor (service, linkProvider, inputValidator) {
    this.#service = service
    this.#linkProvider = linkProvider
    this.#inputValidator = inputValidator
  }

  /**
   * Provide req.requestedTour to the route if :id is present.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} id - The value of the id for the task to load.
   */
  async loadTour (req, res, next, id) {
    try {
      const tours = await this.#service.get({ _id: id, skier: req.requestedUser.id })

      if (tours.length === 0) {
        next(createError(404, 'The requested resource was not found.'))
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
    const collectionURL = this.#getCollectionURL(req)

    res.json({
      tour: {
        data: req.requestedTour,
        links: this.#linkProvider.getDocumentLinks(`${collectionURL}/${req.requestedTour.id}`, req.authenticatedUser?.sub === req.requestedUser.id)
      },
      links: this.#linkProvider.getFindLinks(collectionURL, req.requestedUser)
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

      if (req.query.pageSize) {
        this.#inputValidator.validatePageSize(req.query.pageSize)
        pageSize = parseInt(req.query.pageSize)
      }

      if (req.query.pageStartIndex) {
        this.#inputValidator.validatePageStartIndex(req.query.pageStartIndex)
        pageStartIndex = parseInt(req.query.pageStartIndex)
      }

      const tours = await this.#service.get({ skier: req.requestedUser.id }, null, { limit: pageSize, skip: pageStartIndex })

      const count = await this.#service.getCount()
      const collectionURL = this.#getCollectionURL(req)

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
        skier: req.requestedUser.id
      }

      const tour = await this.#service.insert(data)
      const collectionURL = this.#getCollectionURL(req)

      res
        .location(`${collectionURL.href}/${tour.id}`)
        .status(201)
        .json({
          tour: {
            data: tour,
            links: this.#linkProvider.getDocumentLinks(`${collectionURL}/${tour.id}`, true)
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

      const tour = await this.#service.update(req.requestedTour.id, partialTour)
      const collectionURL = this.#getCollectionURL(req)

      res.json({
        tour: {
          data: tour,
          links: this.#linkProvider.getDocumentLinks(`${collectionURL}/${tour.id}`, true)
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

      const tour = await this.#service.replace(req.requestedTour.id, { date, duration, distance, temperature, wax, glide, grip, description, skier: req.requestedUser.id })

      const collectionURL = this.#getCollectionURL(req)

      res.json({
        tour: {
          data: tour,
          links: this.#linkProvider.getDocumentLinks(`${collectionURL}/${tour.id}`, true)
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
      await this.#service.delete(req.requestedTour.id)

      const collectionURL = this.#getCollectionURL(req)
      const links = this.#linkProvider.getDeleteLinks(collectionURL, req.requestedTour.id)

      res.json({ links })
    } catch (error) {
      next(error)
    }
  }

  #getCollectionURL (req) {
    return new URL(`${req.protocol}://${req.get('host')}${req.baseUrl}`)
  }
}
