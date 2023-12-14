// DOCUMENTED
/**
 * This file contains the implementation of the ChatMessageService class.
 * For more information, see https://dove.feathersjs.com/guides/cli/service.class.html#database-services.
 */

import type { Application, Params } from '@feathersjs/feathers'
import type { KnexAdapterOptions, KnexAdapterParams } from '@feathersjs/knex'
import { KnexService } from '@feathersjs/knex'
import type { MessageData, MessagePatch, MessageQuery } from './messages.schema'

export type MessageParams = KnexAdapterParams<MessageQuery>

export class ChatMessageService<
  ServiceParams extends Params = MessageParams
> extends KnexService<MessageParams, MessageData, ServiceParams, MessagePatch> { }

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
