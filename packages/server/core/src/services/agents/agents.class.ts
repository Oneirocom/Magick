// DOCUMENTED
// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexAdapter } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'
import { app } from '../../app'
import md5 from 'md5'
import type { Application } from '../../declarations'
import type { Agent, AgentData, AgentPatch, AgentQuery } from './agents.schema'
import type { AgentCommandData, RunRootSpellArgs } from 'server/agents'
import { NotFound } from '@feathersjs/errors'
import { AgentInterface } from '../../schemas'

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
> extends KnexAdapter<AgentInterface, AgentData, ServiceParams, AgentPatch> {
  app: Application

  constructor(options: KnexAdapterOptions, app: Application) {
    super(options)
    this.app = app
  }

  async get(agentId: string, params: ServiceParams) {
    const db = app.get('dbClient')
    const currentReleaseVersionId = params.query?.currentReleaseVersionId

    const query = super.createQuery(params)

    if (agentId && !currentReleaseVersionId) {
      const count = await db('agentReleases').count('*').as('count').where('agent_id', '=', agentId)

      if (count["count"] > 0) {
        query
          .leftJoin('agentRelease as releases', function() {
            this.on('agents.id', '=', 'agentReleases.agentId')
          })
      }

    } else if (agentId && currentReleaseVersionId) {

      query
        .leftJoin('agentRelease as releases', function() {
          this.on('agents.id', '=', 'agentReleases.agentId').andOn(currentReleaseVersionId, '=', 'agentReleases.releaseVersion')
        })
    }

    const data = await query.andWhere('agents.id', '=', agentId).limit(1).first()
    if (!data) {
      throw new NotFound(`No record found for id '${agentId}'`)
    }

    return data
  }

  async find(params?: ServiceParams) {
    return await this._find(params)
  }

  async update(id: string, data: AgentInterface, params?: ServiceParams) {
    // Call the original update method to handle other updates
    return this._update(id, data, params);
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

  /*
   * Creates a new agent by copying data from the provided agentId, then associates it with a version tag in the AgentReleases table.
   * @param agentId - the ID of the agent to copy from
   * @param versionTag - the version tag to associate with the newly created agent
   */
  async createRelease(agentId: string, versionTag: string): Promise<{ agent: Agent, release: any }> {
    // Get the agent by its agentId
    const agentData = await this.app.service('agents').get(agentId, {});

    if (!agentData) {
      throw new Error(`Agent with ID ${agentId} not found.`);
    }

    delete agentData.id;
    agentData.currentReleaseVersionId = versionTag;
    // Copy data from the fetched agent, omitting the ID field to create a new agent
    const newAgent = await this.app.service('agents').create(agentData);

    // Add the new agent's ID and the provided version tag to the AgentReleases table
    const db = this.app.get('dbClient');
    const release = await app.service('agentReleases').create({
      agentId: newAgent.id,
      version: versionTag,
    });

    // TODO: this is a little ugly, but it's alright for now
    // Might want to change it if/when we move away from feathers
    const finalNewAgent = await this.app.service('agents').patch(newAgent.id, { ...newAgent, currentReleaseVersionId: release.id });

    return { agent: finalNewAgent, release };
  }

  async create(
    data: AgentData | AgentData[] | any
  ): Promise<Agent | Agent[] | any> {
    // ADDING REST API KEY TO AGENT's DATA

    if (data.data) {
      data.data = JSON.stringify({
        ...typeof data.data === 'string' ? JSON.parse(data.data) : data.data,
        rest_api_key: md5(Math.random().toString()),
      })
    } else {
      data.data = JSON.stringify({
        rest_enabled: true,
        rest_api_key: md5(Math.random().toString()),
      })
    }

    return await this._create(data)
  }

  async patch(agentId: string, params: AgentPatch) {
    return this._patch(agentId, params)
  }

  async remove(agentId: string | null, params: ServiceParams) {
    return this._remove(agentId, params)
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
