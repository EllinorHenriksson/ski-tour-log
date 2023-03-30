export class LinkProviderBase {
  getDocumentLinks (documentURL, authorized) {
    const links = {
      self: {
        method: 'GET',
        href: documentURL
      }
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
        href: `${collectionURL}?pageSize=${pageSize}&pageStartIndex=${pageStartIndex - pageSize}`
      }
    }

    if (pageStartIndex + pageSize < count) {
      links.next = {
        method: 'GET',
        href: `${collectionURL}?pageSize=${pageSize}&pageStartIndex=${pageStartIndex + pageSize}`
      }
    }

    return links
  }

  populateWithLinks (docs, collectionURL) {
    const docsWithLinks = []

    for (const doc in docs) {
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
}
