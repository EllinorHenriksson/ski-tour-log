/**
 * Encapsulates a link provider.
 */
export class LinkProvider {
  populateWithSelfLink (users, collectionURL) {
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

  getCollectionLinks (collectionURL) {
    // TODO: Paginering! Next och prev!
    return {
      self: {
        method: 'GET',
        href: collectionURL
      },
      next: {
        method: 'GET',
        href: ''
      },
      prev: {
        method: 'GET',
        href: ''
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
  }
}
