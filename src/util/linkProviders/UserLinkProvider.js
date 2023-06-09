import { LinkProviderBase } from './LinkProviderBase.js'

/**
 * Represents a user link provider (for hypermedia links connected to the type User).
 */
export class UserLinkProvider extends LinkProviderBase {
  /**
   * Gets the relevant hypermedia links on a document level.
   *
   * @param {string} documentURL - The url of the document.
   * @param {boolean} authenticated - True if the user is authenticated.
   * @param {boolean} authorized - True if the user is authorized.
   * @returns {object} - An object with link objects.
   */
  getDocumentLinks (documentURL, authenticated, authorized) {
    const links = super.getDocumentLinks(documentURL, authenticated, authorized)

    links.tours = {
      method: 'GET',
      href: `${documentURL}/tour`
    }

    links.webhooks = {
      method: 'GET',
      href: `${documentURL}/webhook`
    }

    if (!authenticated) {
      links.tours.description = 'Requires authentication'
      links.webhooks.description = 'Requires authentication'
    }

    return links
  }

  /**
   * Gets hypermeda links for when registering a user.
   *
   * @param {string} collectionURL - The url of the user collection.
   * @returns {object} - An object with link objects.
   */
  getRegisterLinks (collectionURL) {
    const links = {
      self: {
        method: 'POST',
        href: `${collectionURL}/register`
      },
      login: {
        method: 'POST',
        href: `${collectionURL}/login`
      },
      unregister: {
        method: 'POST',
        href: `${collectionURL}/login`,
        description: 'Requires authentication'
      }
    }

    return links
  }

  /**
   * Gets hypermedia links for when a user logs in.
   *
   * @param {string} collectionURL - The url of the user collection.
   * @param {string} id - The id of the user that logged in.
   * @returns {object} An object with link objects.
   */
  getLoginLinks (collectionURL, id) {
    const links = {
      self: {
        method: 'POST',
        href: `${collectionURL}/login`
      },
      unregister: {
        method: 'POST',
        href: `${collectionURL}/unregister`,
        description: 'Requires authentication'
      },
      profile: {
        method: 'GET',
        href: `${collectionURL}/${id}`,
        description: 'Requires authentication'
      }
    }

    return links
  }

  /**
   * Gets hypermedia links when unregistering a user.
   *
   * @param {string} collectionURL - The url of the user collection.
   * @returns {object} An object with link objects.
   */
  getUnregisterLinks (collectionURL) {
    const links = {
      self: {
        method: 'POST',
        href: `${collectionURL}/unregister`
      },
      register: {
        method: 'POST',
        href: `${collectionURL}/register`
      }
    }

    return links
  }
}
