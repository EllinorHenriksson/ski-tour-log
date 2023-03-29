/**
 * Module for the TourController.
 */

import createError from 'http-errors'
import { TourService } from '../services/TourService.js'
import { InputValidator } from '../util/InputValidator.js'
import { LinkProvider } from '../util/LinkProvider.js'

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
   * @type {LinkProvider}
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
   * @param {LinkProvider} linkProvider - A link provider.
   * @param {InputValidator} inputValidator - An input validator.
   */
  constructor (service, linkProvider, inputValidator) {
    this.#service = service
    this.#linkProvider = linkProvider
    this.#inputValidator = inputValidator
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

      const links = this.#linkProvider.getDocumentLinksTour(collectionURL, tour.id, true)

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
