import { LinkProvider } from './LinkProvider.js'

export class NonUserLinkProvider extends LinkProvider {
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
}
