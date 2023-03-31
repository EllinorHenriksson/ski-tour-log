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
