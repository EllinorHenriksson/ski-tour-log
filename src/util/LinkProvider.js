/**
 * Encapsulates a link provider.
 */
export class LinkProvider {
  getRegisterLinks (collectionURL, id) {
    const links = this.getDocumentLinks(collectionURL, id)

    links.register = {
      method: 'POST',
      href: `${collectionURL}/register`
    }

    links.login = {
      method: 'POST',
      href: `${collectionURL}/login`
    }

    return links
  }

  getDocumentLinks (collectionURL, id) {
    const documentURL = `${collectionURL}/${id}`
    return {
      self: {
        method: 'GET',
        href: documentURL
      },
      update: {
        method: 'PATCH',
        href: documentURL
      },
      replace: {
        method: 'PUT',
        href: documentURL
      },
      tours: {
        method: 'GET',
        href: `${documentURL}/tours`
      },
      createTours: {
        method: 'POST',
        href: `${documentURL}/tours`
      },
      collection: {
        method: 'GET',
        href: collectionURL
      }
    }
  }

  getLoginLinks (collectionURL, id) {
    return {
      self: {
        method: 'POST',
        href: `${collectionURL}/login`
      },
      profile: {
        method: 'GET',
        href: `${collectionURL}/${id}`
      },
      collection: {
        method: 'GET',
        href: collectionURL
      },
      register: {
        method: 'POST',
        href: `${collectionURL}/register`
      }
    }
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

    links.login = {
      method: 'POST',
      href: `${collectionURL}/login`
    }

    links.register = {
      method: 'POST',
      href: `${collectionURL}/register`
    }

    return links
  }
}
