import { LinkProviderBase } from './LinkProviderBase.js'

export class TourLinkProvider extends LinkProviderBase {
  getDocumentLinks (collectionURL, id, authorized) {
    const documentURL = `${collectionURL}/${id}`
    const links = super.getDocumentLinks(collectionURL, id, authorized)

    if (authorized) {
      links.delete = {
        method: 'DELETE',
        href: documentURL
      }
    }

    return links
  }

  getCollectionLinks (collectionURL, pageInfo, authorized) {
    const links = super.getCollectionLinks(collectionURL, pageInfo)

    if (authorized) {
      links.create = {
        method: 'POST',
        href: collectionURL
      }
    }

    return links
  }
}
