/**
 * Mongoose model WebhookModel.
 */

import mongoose from 'mongoose'
import validator from 'validator'
const { isURL } = validator

// Create a schema.
const schema = new mongoose.Schema({
  endpoint: {
    type: String,
    maxLength: [500, 'The endpoint must not be longer than 500 characters'],
    validate: [isURL, 'The endpoint must be in a valid URL format'],
    required: [true, 'Endpoint is required']
  },
  token: {
    type: String,
    match: [/^[A-Za-z0-9_-]{1,300}$/, 'The token must be an alphanumerical string of maximum 300 characters'],
    required: [true, 'Token is required']
  },
  user: {
    type: Boolean,
    required: [true, 'User (true/false) is required']
  },
  tour: {
    type: Boolean,
    required: [true, 'Tour (true/false) is required']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner is required']
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
  }
}

schema.set('timestamps', true)
schema.set('toObject', convertOptions)
schema.set('toJSON', convertOptions)

// Create a model using the schema.
export const WebhookModel = mongoose.model('Webhook', schema)
