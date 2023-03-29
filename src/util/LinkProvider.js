/**
 * Encapsulates a link provider.
 */
export class LinkProvider {
  getRegisterLinks (collectionURL, id) {
    const links = this.getDocumentLinks(collectionURL, id)

    links.login = {
      method: 'POST',
      href: `${collectionURL}/login`
    }

    return links
  }

  getDocumentLinks (collectionURL, id, authorized) {
    const documentURL = `${collectionURL}/${id}`
    const links = {
      self: {
        method: 'GET',
        href: documentURL
      },
      tours: {
        method: 'GET',
        href: `${documentURL}/tour`
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

  getDocumentLinksTour (collectionURL, tourId, authorized) {
    const documentURL = `${collectionURL}/${tourId}`
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

      links.delete = {
        method: 'DELETE',
        href: documentURL
      }
    }

    return links
  }

  getCollectionLinksTours (collectionURL, pageInfo, authorized) {
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

    if (authorized) {
      links.create = {
        method: 'POST',
        href: collectionURL
      }
    }

    return links
  }
}
