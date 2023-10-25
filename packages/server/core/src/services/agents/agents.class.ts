// DOCUMENTED
// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'
import { app } from '../../app'
import md5 from 'md5'
import type { Application } from '../../declarations'
import type { Agent, AgentData, AgentPatch, AgentQuery } from './agents.schema'
import type { AgentCommandData, RunRootSpellArgs } from 'server/agents'

// Define AgentParams type based on KnexAdapterParams with AgentQuery
export type AgentParams = KnexAdapterParams<AgentQuery>

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

  async get(agentId: string, params: ServiceParams) {
    const { versionTag } = params
    const db = app.get('dbClient')

    const agents = db('agents')
      .select('agents.*')
      .innerJoin('AgentReleases', 'agents.id', 'AgentReleases.agent_id')
      .groupBy('agentId')

    return agents
  }

  async find(params?: ServiceParams): Promise<Agent[] | Paginated<Agent>> {
    // Modify the query to exclude agents with the frozen flag set
    const { query = {} } = params || {};
    query.frozen = false;  // Only fetch agents where frozen is false

    // Call the original find method with the modified query
    return super.find({ ...params, query });
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

  /**
   * Executes a command on the agent.
   * @param data - The data required to execute the command.
   * @returns An object containing the response from the agent.
   */
  async command(data: AgentCommandData) {
    const agentCommander = this.app.get('agentCommander')
    const response = await agentCommander.command(data)

    return { response }
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

<<<<<<< HEAD:packages/server/core/src/services/agents/agents.class.ts
  async subscribe(agentId: string, params: ServiceParams) {
    // check for socket io
    if (!params.provider)
      throw new Error('subscribe is only available via socket io')

    // get the socket from the params
    const connection = params.connection

    if (!connection) throw new Error('connection is required')

    if (app.get('environment') !== 'server') return

    const oldAgentChannel = app.channels.filter(channel =>
      channel.match(/agent:/)
    )[0]

    if (oldAgentChannel) {
      const oldAgentId = oldAgentChannel.split(':')[1]
      // leave the old channel
      app.channel(oldAgentChannel).leave(connection)

      // turn off the old agent
      this.command({
        agentId: oldAgentId,
        command: 'agent:core:toggleLive',
        data: {
          live: false,
        },
      })
    }

    // join the new channel
    this.app.get('logger').debug(`Subscribing to agent ${agentId}`)
    app.channel(`agent:${agentId}`).join(connection)

    // turn on the new agent
    this.command({
      agentId,
      command: 'agent:core:toggleLive',
      data: {
        live: true,
      },
    })

    return true
  }

  /**
  * Creates a new agent by copying data from the provided agentId, then associates it with a version tag in the AgentReleases table.
  * @param agentId - the ID of the agent to copy from
  * @param versionTag - the version tag to associate with the newly created agent
  */
  async copyAndRelease(agentId: string, versionTag: string): Promise<{agent: Agent, release: any}> {
    // Get the agent by its agentId
    const existingAgent = await this.app.service('agents').get(agentId);
    if (!existingAgent) {
      throw new Error(`Agent with ID ${agentId} not found.`);
    }

    // Copy data from the fetched agent, omitting the ID field to create a new agent
    const { id, ...agentData } = existingAgent;
    const newAgent = await this.app.service('agents').create(agentData);

    // Add the new agent's ID and the provided version tag to the AgentReleases table
    const db = this.app.get('dbClient');
    const release = await db('AgentReleases').insert({
      agent_id: newAgent.id,
      version: versionTag,
    });

    return { agent: newAgent, release };
  }


  override async create(
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
