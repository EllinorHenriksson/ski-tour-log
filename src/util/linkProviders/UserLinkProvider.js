import { LinkProviderBase } from './LinkProviderBase.js'

export class UserLinkProvider extends LinkProviderBase {
  getRegisterLinks (collectionURL, id) {
    const links = {
      self: {
        method: 'GET',
        href: `${collectionURL}/${id}`,
        description: 'Requires authentication'
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

  getDocumentLinks (collectionURL, id, authorized) {
    const documentURL = `${collectionURL}/${id}`
    const links = super.getDocumentLinks(collectionURL, id, authorized)

    links.tours = {
      method: 'GET',
      href: `${documentURL}/tour`
    }

    return links
  }
}
