import { LinkProviderBase } from './LinkProviderBase.js'

export class UserLinkProvider extends LinkProviderBase {
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
