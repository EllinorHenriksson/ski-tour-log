/**
 * Encapsulates a link provider.
 */
export class LinkProvider {
  populateWithSelfLinks (users, collectionURL) {
    const usersWithLinks = []
    for (const user of users) {
      const userObject = user.toObject()
      userObject.links = {
        self: {
          method: 'GET',
          href: `${collectionURL}/${user.id}`
        }
      }
      usersWithLinks.push(userObject)
    }
    return usersWithLinks
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
      },
      register: {
        method: 'POST',
        href: `${collectionURL}/register`
      },
      login: {
        method: 'POST',
        href: `${collectionURL}/login`
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
      },
      login: {
        method: 'POST',
        href: `${collectionURL}/login`
      },
      register: {
        method: 'POST',
        href: `${collectionURL}/register`
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
