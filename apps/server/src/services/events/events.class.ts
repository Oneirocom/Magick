// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { Event, EventData, EventPatch, EventQuery } from './events.schema'

export interface EventParams extends KnexAdapterParams<EventQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class EventService<ServiceParams extends Params = EventParams> extends KnexService<
  Event,
  EventData,
  ServiceParams,
  EventPatch
> {}


export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'events'
  }
}
