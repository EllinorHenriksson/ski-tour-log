import createError, { HttpError } from 'http-errors'

/**
 * Represents an input validator.
 */
export class InputValidator {
  /**
   * Validates the page size query value.
   *
   * @param {string} pageSize - The page size query value.
   * @throws {HttpError} If page size does not correspont to a positive integer.
   */
  validatePageSize (pageSize) {
    const pageSizeInt = parseInt(pageSize)

    if (isNaN(pageSizeInt) || pageSizeInt <= 0) {
      throw createError(400, 'Page size must be a positive integer')
    }
  }

  /**
   * Validates the page start index query value.
   *
   * @param {string} pageStartIndex - The page start index query value.
   * @throws {HttpError} If page start index does not correspont to a positive integer or 0.
   */
  validatePageStartIndex (pageStartIndex) {
    const pageStartIndexInt = parseInt(pageStartIndex)

    if (isNaN(pageStartIndexInt) || pageStartIndexInt < 0) {
      throw createError(400, 'Page start index must be a positive integer or 0')
    }
  }
}
