// For more information about this file see https://dove.feathersjs.com/guides/cli/client.html
import { feathers } from '@feathersjs/feathers'
import type { TransportConnection, Params } from '@feathersjs/feathers'
import type {
  SpellRunnerService
} from './services/spell-runner/spell-runner'
export const spellRunnerServiceMethods = ['get', 'create', 'update'] as const
import type { Spell, SpellData, SpellQuery, SpellService } from './services/spells/spells'
export type { Spell, SpellData, SpellQuery }
export const spellServiceMethods = ['find', 'get', 'create', 'patch', 'remove'] as const
export type SpellClientService = Pick<SpellService<Params<SpellQuery>>, (typeof spellServiceMethods)[number]>

import type { Agent, AgentData, AgentQuery, AgentService } from './services/agents/agents'
export type { Agent, AgentData, AgentQuery }
export const agentServiceMethods = ['find', 'get', 'create', 'patch', 'remove'] as const
export type AgentClientService = Pick<AgentService<Params<AgentQuery>>, (typeof agentServiceMethods)[number]>

import type { Request, RequestData, RequestQuery, RequestService } from './services/request/request'
export type { Request, RequestData, RequestQuery }
export const requestServiceMethods = ['find', 'get', 'create', 'patch', 'remove'] as const
export type RequestClientService = Pick<
  RequestService<Params<RequestQuery>>,
  (typeof requestServiceMethods)[number]
>

export interface ServiceTypes {
  request: RequestClientService
  'spell-runner': SpellRunnerService
  spells: SpellClientService
  agents: AgentClientService
  //
}

/**
 * Returns a typed client for the server app.
 *
 * @param connection The REST or Socket.io Feathers client connection
 * @see https://dove.feathersjs.com/api/client.html
 * @returns The Feathers client application
 */
export const createClient = <Configuration = any>(connection: TransportConnection<ServiceTypes>) => {
  const client = feathers<ServiceTypes, Configuration>()

  client.configure(connection)

  client.use('agents', connection.service('agents'), {
    methods: agentServiceMethods
  })
  client.use('spells', connection.service('spells'), {
    methods: spellServiceMethods
  })
  client.use('spell-runner', connection.service('spell-runner'), {
    methods: spellRunnerServiceMethods
  })
  client.use('request', connection.service('request'), {
    methods: requestServiceMethods
  })
  return client
}
