import { LinkProviderBase } from './LinkProviderBase.js'

export class NonUserLinkProvider extends LinkProviderBase {
  getDocumentLinks (documentURL, authenticated, authorized) {
    const links = super.getDocumentLinks(documentURL, authenticated, authorized)

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
