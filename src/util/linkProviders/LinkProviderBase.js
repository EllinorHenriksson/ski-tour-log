export class LinkProviderBase {
  getDocumentLinks (collectionURL, id, authorized) {
    const documentURL = `${collectionURL}/${id}`
    const links = {
      self: {
        method: 'GET',
        href: documentURL
      },
      collection: {
        method: 'GET',
        href: collectionURL
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

  getCollectionLinks (collectionURL, pageInfo) {
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
}
