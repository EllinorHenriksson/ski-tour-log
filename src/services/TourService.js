/**
 * Module for the TourService.
 */

import { MongooseServiceBase } from './MongooseServiceBase.js'
import { TourRepository } from '../repositories/TourRepository.js'

/**
 * Encapsulates a tour service.
 */
export class TourService extends MongooseServiceBase {
  /**
   * Initializes a new instance.
   *
   * @param {TourRepository} [repository = new TourRepository()] - A repository instantiated from a class with the same capabilities as TourRepository.
   */
  constructor (repository = new TourRepository()) {
    super(repository)
  }
}
