import { LinkProviderBase } from './LinkProviderBase.js'

/**
 * Represents a non-user link provider (for hypermedia links connected to types other that User, i.e. Tour and Webhook).
 */
export class NonUserLinkProvider extends LinkProviderBase {
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

    if (authorized) {
      links.delete = {
        method: 'DELETE',
        href: documentURL
      }
    }

    return links
  }

  /**
   * Gets the relevant hypermedia links on a collection level.
   *
   * @param {string} collectionURL - The url of the collection.
   * @param {object} pageInfo - An object with the properties pageSize, pageStartIndex and count.
   * @param {boolean} authorized - True if the user is authorized (defaults to null).
   * @returns {object} - An object with link objects.
   */
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
