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
}
