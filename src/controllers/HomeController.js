/**
 * Module for the HomeController.
 */

/**
 * Encapsulates a home controller.
 */
export class HomeController {
  index (req, res, next) {
    const url = `${req.protocol}://${req.get('host')}${req.baseUrl}`

    const links = {
      users: {
        method: 'GET',
        href: `${url}/users`,
        description: 'Requires authentication'
      },
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
