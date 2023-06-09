import jwt from 'jsonwebtoken'
import createError from 'http-errors'

/**
 * Represent an authentication tool to be used by the different routers.
 */
export class AuthTool {
  /**
   * Authenticates requests and populates req.authenticatedUser with the user id.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async authenticateJWT (req, res, next) {
    try {
      const authHeader = req.headers.authorization

      if (!authHeader) {
        throw new Error('No authorizaton header')
      }

      const [authenticationScheme, token] = authHeader.split(' ')

      if (authenticationScheme !== 'Bearer') {
        throw new Error('Invalid authentication scheme')
      }

      const publicKey = Buffer.from(process.env.PUBLIC_KEY, 'base64')

      req.authenticatedUser = jwt.verify(token, publicKey)

      next()
    } catch (err) {
      const error = createError(401, 'JWT invalid or not provided')
      error.cause = err
      next(error)
    }
  }

  /**
   * Authorizes the user, only if she/he is the owner of the requested resource.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  authorizeUser (req, res, next) {
    if (req.authenticatedUser.sub !== req.requestedUser.id) {
      next(createError(403, 'You do not have rights to this resource'))
    }

    next()
  }
}
