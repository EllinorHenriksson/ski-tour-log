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

    const links = this.#linkProvider.getDocumentLinks(collectionURL, req.requestedTour.id, req.authenticatedUser?.sub === req.requestedUser.id)

    res.json({ data: req.requestedTour, links })
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

      const tours = await this.#service.get(null, null, { limit: pageSize, skip: pageStartIndex })

      const count = await this.#service.getCount()

      const collectionURL = this.#getCollectionURL(req)
      const links = this.#linkProvider.getCollectionLinks(collectionURL, { pageSize, pageStartIndex, count }, req.authenticatedUser?.sub === req.requestedUser.id)

      res.json({ data: tours, links })
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

      const links = this.#linkProvider.getDocumentLinks(collectionURL, tour.id, true)

      res
        .location(`${collectionURL.href}/${tour.id}`)
        .status(201)
        .json({ data: tour, links })
    } catch (error) {
      let err = error
      if (error.name === 'ValidationError') {
        err = createError(400, error.message)
      }

      next(err)
    }
  }

  #getCollectionURL (req) {
    return new URL(`${req.protocol}://${req.get('host')}${req.baseUrl}`)
  }
}
