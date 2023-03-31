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
      profile: {
        method: 'GET',
        href: `${collectionURL}/${id}`,
        description: 'Requires authentication'
      }
    }

    return links
  }
}
