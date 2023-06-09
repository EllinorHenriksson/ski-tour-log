/**
 * Module for the HomeController.
 */

/**
 * Encapsulates a home controller.
 */
export class HomeController {
  /**
   * Sends back links to start using the API.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  index (req, res, next) {
    const url = `${req.protocol}://${req.get('host')}${req.baseUrl}`

    const links = {
      register: {
        method: 'POST',
        href: `${url}/users/register`
      },
      login: {
        method: 'POST',
        href: `${url}/users/login`
      }
    }

    res.json({ name: 'Ski Tour Log', version: 1, links })
  }
}
