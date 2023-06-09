/**
 * Represents a link provider base.
 */
export class LinkProviderBase {
  /**
   * Gets the relevant hypermedia links on a document level.
   *
   * @param {string} documentURL - The url of the document.
   * @param {boolean} authenticated - True if the user is authenticated.
   * @param {boolean} authorized - True if the user is authorized.
   * @returns {object} - An object with link objects.
   */
  getDocumentLinks (documentURL, authenticated, authorized) {
    const links = {
      self: {
        method: 'GET',
        href: documentURL
      }
    }

    if (!authenticated) {
      links.self.description = 'Requires authentication'
    }

    if (authorized) {
      links.update = {
        method: 'PATCH',
        href: documentURL
      }

      links.replace = {
        method: 'PUT',
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
    const { pageSize, pageStartIndex, count } = pageInfo

    const links = {
      self: {
        method: 'GET',
        href: collectionURL
      }
    }

    if (pageStartIndex - pageSize >= 0) {
      links.prev = {
        method: 'GET',
        href: `${collectionURL}?page-size=${pageSize}&page-start-index=${pageStartIndex - pageSize}`
      }
    }

    if (pageStartIndex + pageSize < count) {
      links.next = {
        method: 'GET',
        href: `${collectionURL}?page-size=${pageSize}&page-start-index=${pageStartIndex + pageSize}`
      }
    }

    return links
  }

  /**
   * Creates and returns an array of documents that have been populated with links.
   *
   * @param {object[]} docs - The documents to populate with links.
   * @param {*} collectionURL - The url of the collection that hte documents belong to.
   * @returns {object[]} The documents populated with links.
   */
  populateWithLinks (docs, collectionURL) {
    const docsWithLinks = []

    for (const doc of docs) {
      const docWithLinks = {
        data: doc,
        links: {
          self: {
            method: 'GET',
            href: `${collectionURL}/${doc.id}`
          }
        }
      }

      docsWithLinks.push(docWithLinks)
    }

    return docsWithLinks
  }

  /**
   * Gets hypermedia links for when creating a document resource.
   *
   * @param {string} collectionURL - The collection URL.
   * @returns {object} An object with link objects.
   */
  getCreateLinks (collectionURL) {
    return {
      self: {
        method: 'POST',
        href: collectionURL
      },
      collection: {
        method: 'GET',
        href: collectionURL
      }
    }
  }

  /**
   * Gets hypermedia links for when finding a document resource.
   *
   * @param {string} collectionURL - The url of the collection that the document resource belongs to.
   * @param {string} id - The id of the document resource.
   * @returns {object} An object with link objects.
   */
  getFindLinks (collectionURL, id) {
    return {
      self: {
        method: 'GET',
        href: `${collectionURL}/${id}`
      },
      collection: {
        method: 'GET',
        href: collectionURL
      }
    }
  }

  /**
   * Gets hypermedia links for when partially updating a document resource.
   *
   * @param {string} collectionURL - The url of the collection that the document resource belongs to.
   * @param {string} id - The id of the document resource.
   * @returns {object} An object with link objects.
   */
  getPatchLinks (collectionURL, id) {
    return {
      self: {
        method: 'PATCH',
        href: `${collectionURL}/${id}`
      },
      collection: {
        method: 'GET',
        href: collectionURL
      }
    }
  }

  /**
   * Gets hypermedia links for when replacing a document resource.
   *
   * @param {string} collectionURL - The url of the collection that the document resource belongs to.
   * @param {string} id - The id of the document resource.
   * @returns {object} An object with link objects.
   */
  getPutLinks (collectionURL, id) {
    return {
      self: {
        method: 'PUT',
        href: `${collectionURL}/${id}`
      },
      collection: {
        method: 'GET',
        href: collectionURL
      }
    }
  }

  /**
   * Gets hypermedia links for when deleting a document resource.
   *
   * @param {string} collectionURL - The url of the collection that the document resource belongs to.
   * @param {string} id - The id of the document resource.
   * @returns {object} An object with link objects.
   */
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
