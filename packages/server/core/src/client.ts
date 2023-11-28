// DOCUMENTED
/**
 * For more information about this file see https://dove.feathersjs.com/guides/cli/client.html
 */

// Importing required modules and types
import { feathers } from '@feathersjs/feathers'
import type { TransportConnection, Params } from '@feathersjs/feathers'

// Defining spell runner service methods
export const spellRunnerServiceMethods = ['get', 'create', 'update'] as const

// Importing Spell related types
import type {
  SpellData,
  SpellQuery,
  SpellService,
} from './services/spells/spells'

// Exporting Spell related types
export type { SpellData, SpellQuery }

// Defining spell service methods
export const spellServiceMethods = [
  'find',
  'get',
  'create',
  'patch',
  'remove',
] as const
export type SpellClientService = Pick<
  SpellService<Params<SpellQuery>>,
  (typeof spellServiceMethods)[number]
>

// Importing Agent related types
import type {
  Agent,
  AgentData,
  AgentQuery,
  AgentService,
} from './services/agents/agents'

// Exporting Agent related types
export type { Agent, AgentData, AgentQuery }

// Defining agent service methods
export const agentServiceMethods = [
  'find',
  'get',
  'create',
  'patch',
  'remove',
] as const
export type AgentClientService = Pick<
  AgentService<Params<AgentQuery>>,
  (typeof agentServiceMethods)[number]
>

// Importing Request related types
import type {
  Request,
  RequestData,
  RequestQuery,
  RequestService,
} from './services/requests/requests'

// Exporting Request related types
export type { Request, RequestData, RequestQuery }

// Defining request service methods
export const requestServiceMethods = [
  'find',
  'get',
  'create',
  'patch',
  'remove',
] as const
export type RequestClientService = Pick<
  RequestService<Params<RequestQuery>>,
  (typeof requestServiceMethods)[number]
>

// Defining the ServiceTypes interface
export interface ServiceTypes {
  request: RequestClientService
  spells: SpellClientService
  agents: AgentClientService
}

/**
 * Returns a typed client for the server app.
 *
 * @param connection - The REST or Socket.io Feathers client connection
 * @see https://dove.feathersjs.com/api/client.html
 * @returns The Feathers client application
 */
export const createClient = <Configuration = any,>(
  connection: TransportConnection<ServiceTypes>
) => {
  // Create a new Feathers client
  const client = feathers<ServiceTypes, Configuration>()

  // Configure the client with the connection
  client.configure(connection)

  // Registering the services
  client.use('agents', connection.service('agents'), {
    methods: agentServiceMethods,
  })
  client.use('spells', connection.service('spells'), {
    methods: spellServiceMethods,
  })
  client.use('request', connection.service('request'), {
    methods: requestServiceMethods,
  })

  // Return the configured client
  client.configure(agentReleaseServiceClient)
  client.configure(agentReleasesClient)
  return client
}
