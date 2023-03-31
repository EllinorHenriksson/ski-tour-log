/**
 * Module for the TourService.
 */

import { MongooseServiceBase } from './MongooseServiceBase.js'
import { WebhookRepository } from '../repositories/WebhookRepository.js'

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

  async trigger (event, action, attributes) {
    let webhooks
    if (event === 'user') {
      webhooks = await this.get({ user: true }, ['endpoint'])
    } else if (event === 'tour') {
      webhooks = await this.get({ tour: true }, ['endpoint'])
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
