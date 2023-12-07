// DOCUMENTED
/**
 * This file contains the implementation of the ChatMessageService class.
 * For more information, see https://dove.feathersjs.com/guides/cli/service.class.html#database-services.
 */

import type { Application, Params } from '@feathersjs/feathers'
import type { KnexAdapterOptions, KnexAdapterParams } from '@feathersjs/knex'
import { KnexAdapter } from '@feathersjs/knex'
import type { MessageData, MessagePatch, MessageQuery } from './messages.schema'

export type MessageParams = KnexAdapterParams<MessageQuery>

export class ChatMessageService<
  ServiceParams extends Params = MessageParams
> extends KnexAdapter<MessageParams, MessageData, ServiceParams, MessagePatch> {
  /**
   * Create a new event.
   * Currently, this function simply returns the provided event data immediately.
   * @param {ChatMessageData} data - The event data object.
   * @returns {Promise<any>} - The created event data.
   */
  async create(data: MessageData): Promise<any> {
    return this._create(data)
  }

  /**
   * Patch an event.
   * Currently, this function simply returns the provided event data immediately.
   * @param {string} id - The ID of the event to patch.
   * @param {MessagePatch} data - The event patch data object.
   * @returns {Promise<any>} - The patched event data.
   */
  async patch(id: string, data: MessagePatch) {
    return this._patch(id, data)
  }

  async get(id: string, params?: ServiceParams) {
    return this._get(id, params)
  }

  async remove(id: string, params?: ServiceParams) {
    return this._remove(id, params)
  }

  /**
   * Find events.
   * This function searches for events in the database given an embedding and other query parameters.
   * @param {ServiceParams} [params] - The query parameters for the search.
   * @returns {Promise<any>} - The search results.
   */
  // @ts-ignore
  async find(params?: ServiceParams) {
    this._find(params)
  }
}

/**
 * Get options for the message service.
 * This function returns the options required by the KnexAdapter.
 * @param {Application} app - The Feathers application object.
 * @returns {KnexAdapterOptions} - The options required by KnexAdapter.
 */
export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: {
      default: 1000,
      max: 1000,
    },
    Model: app.get('dbClient'),
    name: 'chatMessages',
  }
}
