/**
 * Mongoose model TourModel.
 */

import mongoose from 'mongoose'

// Create a schema.
const schema = new mongoose.Schema({
  date: {
    type: Date
  },
  durationMin: {
    type: Number,
    min: [0, 'The duration (min) must be a positive number or 0']
  },
  distanceMeter: {
    type: Number,
    min: [0, 'The distance (m) must be a positive number or 0']
  },
  temperatureCelcius: {
    type: Number
  },
  wax: {
    type: String,
    maxLength: [50, 'Wax must not contain more than 50 characters']
  },
  glide: {
    type: Number,
    enum: [[1, 2, 3, 4, 5], 'Glide must be an integer between 1 and 5']
  },
  grip: {
    type: Number,
    enum: [[1, 2, 3, 4, 5], 'Grip must be an integer between 1 and 5']
  },
  description: {
    type: String,
    maxLength: [500, 'Decsription must not contain more than 500 characters']
  }
})

schema.virtual('id').get(function () {
  return this._id.toHexString()
})

const convertOptions = {
  virtuals: true,
  versionKey: false,
  /**
   * Performs a transformation of the resulting object to remove sensitive information.
   *
   * @param {object} doc - The mongoose document which is being converted.
   * @param {object} ret - The plain object representation which has been converted.
   */
  transform: (doc, ret) => {
    delete ret._id
    delete ret.createdAt
    delete ret.updatedAt
  }
}

schema.set('timestamps', true)
schema.set('toObject', convertOptions)
schema.set('toJSON', convertOptions)

// Create a model using the schema.
export const TourModel = mongoose.model('Tour', schema)
