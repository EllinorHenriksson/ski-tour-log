import { LinkProviderBase } from './LinkProviderBase.js'

export class UserLinkProvider extends LinkProviderBase {
  getDocumentLinks (documentURL, authorized) {
    const links = super.getDocumentLinks(documentURL, authorized)

    links.tours = {
      method: 'GET',
      href: `${documentURL}/tour`
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
