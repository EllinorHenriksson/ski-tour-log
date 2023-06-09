/**
 * Module for the TourService.
 */

import { MongooseServiceBase } from './MongooseServiceBase.js'
import { WebhookRepository } from '../repositories/WebhookRepository.js'

import fetch from 'node-fetch'

/**
 * Encapsulates a webhook service.
 */
export class WebhookService extends MongooseServiceBase {
  /**
   * Initializes a new instance.
   *
   * @param {WebhookRepository} [repository = new WebhookRepository()] - A repository instantiated from a class with the same capabilities as WebhookRepository.
   */
  constructor (repository = new WebhookRepository()) {
    super(repository)
  }

  /**
   * Triggers all registered webhooks for the current event.
   *
   * @param {string} event - The event.
   * @param {string} action - The action.
   * @param {object} attributes - The attributes of the modified resource.
   * @returns {Promise} - A promise that resolves with all resolved promises of the sent out webhook requests.
   */
  async trigger (event, action, attributes) {
    let webhooks
    if (event === 'user') {
      webhooks = await this.get({ user: true }, ['endpoint'])
    } else if (event === 'tour') {
      webhooks = await this.get({ tour: true }, ['endpoint', 'token'])
    }

    const promises = []
    for (const webhook of webhooks) {
      const promise = fetch(webhook.endpoint, {
        method: 'POST',
        headers: {
          'X-Skitourlog-Token': webhook.token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          event,
          action,
          attributes
        })
      })
      promises.push(promise)
    }

    return Promise.all(promises)
  }
}
