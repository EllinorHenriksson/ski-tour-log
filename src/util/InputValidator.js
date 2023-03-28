import createError from 'http-errors'

/**
 * Represents an input validator.
 */
export class InputValidator {
  validatePageSize (pageSize) {
    const pageSizeInt = parseInt(pageSize)

    if (isNaN(pageSizeInt) || pageSizeInt <= 0) {
      throw createError(400, 'Page size must be a positive integer')
    }
  }

  validatePageStartIndex (pageStartIndex) {
    const pageStartIndexInt = parseInt(pageStartIndex)

    if (isNaN(pageStartIndexInt) || pageStartIndexInt < 0) {
      throw createError(400, 'Page start index must be a positive integer or 0')
    }
  }
}
