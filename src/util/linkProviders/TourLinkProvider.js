import { LinkProviderBase } from './LinkProviderBase.js'

export class TourLinkProvider extends LinkProviderBase {
  getDocumentLinks (documentURL, authorized) {
    const links = super.getDocumentLinks(documentURL, authorized)

    if (authorized) {
      links.delete = {
        method: 'DELETE',
        href: documentURL
      }
    }

    return links
  }

  getCollectionLinks (collectionURL, pageInfo, authorized = null) {
    const links = super.getCollectionLinks(collectionURL, pageInfo)

    if (authorized) {
      links.create = {
        method: 'POST',
        href: collectionURL
      }
    }

    return links
  }

  getCreateLinks (collectionURL) {
    return {
      self: {
        method: 'POST',
        href: collectionURL
      },
      collectionURL: {
        method: 'GET',
        href: collectionURL
      }
    }
  }

  getDeleteLinks (collectionURL, id) {
    const links = {
      self: {
        method: 'DELETE',
        href: `${collectionURL}/${id}`
      },
      collection: {
        method: 'GET',
        href: collectionURL
      }
    }

    return links
  }
}
