/**
 * Module for the MongooseServiceBase.
 */

import { MongooseRepositoryBase } from '../repositories/MongooseRepositoryBase.js'

/**
 * Encapsulates a Mongoose service base.
 */
export class MongooseServiceBase {
  /**
   * The repository.
   *
   * @type {MongooseRepositoryBase}
   */
  _repository // protected!!!

  /**
   * Initializes a new instance.
   *
   * @param {MongooseRepositoryBase} repository - A repository instantiated from a class inherited from MongooseRepositoryBase.
   */
  constructor (repository) {
    this._repository = repository
  }

  /**
   * Gets all documents.
   *
   * @param {object} filter - Filter to apply to the query.
   * @param {object|string|string[]} [projection] - Fields to return.
   * @param {object} [options] - See Query.prototype.setOptions().
   * @returns {Promise<object[]>} Promise resolved with the found documents.
   */
  async get (filter, projection = null, options = null) {
    return this._repository.get(filter, projection, options)
  }

  async getCount () {
    return this._repository.getCount()
  }

  /**
   * Gets a document by ID.
   *
   * @param {string} id - The value of the id for the document to get.
   * @returns {Promise<object>} Promise resolved with the found document.
   */
  async getById (id) {
    return this._repository.getById(id)
  }

  /**
   * Inserts a new document.
   *
   * @param {object} data - The data to insert.
   * @returns {Promise<object>} Promise resolved with the created document.
   */
  async insert (data) {
    return this._repository.insert(data)
  }

  /**
   * Updates a document.
   *
   * @param {string} id - The value of the id for the document to update.
   * @param {object} updateData - The new data to update the existing document with.
   * @returns {Promise<object>} Promise resolved with the updated document.
   */
  async update (id, updateData) {
    return this._repository.update(id, updateData)
  }

  /**
   * Replaces a document.
   *
   * @param {string} id - The value of the id for the document to update.
   * @param {object} replaceData - The new data to replace the existing document with.
   * @returns {Promise<object>} Promise resolved with the updated document.
   */
  async replace (id, replaceData) {
    return this._repository.replace(id, replaceData)
  }

  /**
   * Deletes a document.
   *
   * @param {string} id - The value of the id for the document to delete.
   * @returns {Promise<object>} Promise resolved with the removed document.
   */
  async delete (id) {
    return this._repository.delete(id)
  }
}
