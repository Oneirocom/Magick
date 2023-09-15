// DOCUMENTED
// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'
import { app } from '@magickml/server-core'
import md5 from 'md5'
import type { Application } from '../../declarations'
import type { Agent, AgentData, AgentPatch, AgentQuery } from './agents.schema'
import { RunRootSpellArgs } from '@magickml/agents'

// Define AgentParams type based on KnexAdapterParams with AgentQuery
export type AgentParams = KnexAdapterParams<AgentQuery>

export type AgentRunData = {
  agentId: string
  content: string
  channel: string
  sender: string
  client: string
}

/**
 * Default AgentService class.
 * Calls the standard Knex adapter service methods but can be customized with your own functionality.
 *
 * @template ServiceParams - The input params for the service
 * @extends KnexService
 */
export class AgentService<
  ServiceParams extends Params = AgentParams
> extends KnexService<Agent, AgentData, ServiceParams, AgentPatch> {
  app: Application

  constructor(options: KnexAdapterOptions, app: Application) {
    super(options)
    this.app = app
  }

  // we use this ping to avoid firing a patched event on the agent
  // every time the agent is pinged
  async ping(agentId: string) {
    const db = app.get('dbClient')
    // knex query to update the pingedAt field of the agent with the given id
    const query = await db('agents').where({ id: agentId }).update({
      pingedAt: new Date().toISOString(),
    })

    return { data: query }
  }

  async run(data: Omit<RunRootSpellArgs, 'agent'>) {
    if (!data.agentId) throw new Error('agentId is required')
    // probably need to authenticate the request here against project id
    // add the job to the queueD

    const agentCommander = this.app.get('agentCommander')
    const response = await agentCommander.runSpellWithResponse(data)

    // return the job id
    return { response }
  }

  async subscribe(agentId: string, params: ServiceParams) {
    // check for socket io
    if (!params.provider)
      throw new Error('subscribe is only available via socket io')

    // get the socket from the params
    const connection = params.connection
    const oldAgentChannel = app.channels.filter(channel =>
      agentId.match(/agent:/)
    )[0]
    // leave the old channel
    app.channel(oldAgentChannel).leave(connection)

    // join the new channel
    app.channel(`agent:${agentId}`).join(connection)

    return true
  }

  async create(
    data: AgentData | AgentData[] | any
  ): Promise<Agent | Agent[] | any> {
    // ADDING REST API KEY TO AGENT's DATA
    if (data.data) {
      data.data = JSON.stringify({
        ...JSON.parse(data.data),
        rest_api_key: md5(Math.random().toString()),
      })
    } else {
      data.data = JSON.stringify({
        rest_enabled: true,
        rest_api_key: md5(Math.random().toString()),
      })
    }

    return await super.create(data)
  }
}

/**
 * Returns options needed to initialize the AgentService.
 *
 * @param app - the Feathers application
 * @returns KnexAdapterOptions - options for initializing the Knex adapter
 */
export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('dbClient'),
    name: 'agents',
    multi: ['remove'],
  }
}
