import {
  KnexAdapterOptions,
  KnexAdapterParams,
  KnexService,
} from '@feathersjs/knex'
import type {
  GraphEventsData,
  GraphEventsPatch,
  GraphEventsQuery,
} from './graphEvents.schema'
import { Application, Params } from '@feathersjs/feathers'

export type GraphParams = KnexAdapterParams<GraphEventsQuery>

export class GraphEventService<
  ServiceParams extends Params = GraphParams
> extends KnexService<
  GraphParams,
  GraphEventsData,
  ServiceParams,
  GraphEventsPatch
> {}

/**
 * Get options for the graph events service
 *  * This function returns the options required by the KnexAdapter.
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
    name: 'graphEvents',
  }
}
