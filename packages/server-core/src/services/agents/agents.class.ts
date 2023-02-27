// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { Agent, AgentData, AgentPatch, AgentQuery } from './agents.schema'

export type AgentParams = KnexAdapterParams<AgentQuery>

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class AgentService<ServiceParams extends Params = AgentParams> extends KnexService<
  Agent,
  AgentData,
  ServiceParams,
  AgentPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('dbClient'),
    name: 'agents'
  }
}
