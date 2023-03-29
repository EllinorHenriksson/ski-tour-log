/**
 * Module for TourRepository.
 */

import { MongooseRepositoryBase } from './MongooseRepositoryBase.js'
import { TourModel } from '../models/TourModel.js'

/**
 * Encapsulates a tour repository.
 */
export class TourRepository extends MongooseRepositoryBase {
  /**
   * Initializes a new instance.
   *
   * @param {TourModel} [model=TourModel] - A class with the same capabilities as TourModel.
   */
  constructor (model = TourModel) {
    super(model)
  }
}
