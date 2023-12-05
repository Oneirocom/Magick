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
import { AgentInterface } from '../../schemas'
import { fetchAllPages } from 'shared/utils'
import { SpellData } from '../spells/spells.schema'
import { v4 as uuidv4 } from 'uuid'

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
    return await this._get(agentId, params)
  }

  // Its easier to imagine an agent having many releases
  // even though we actually version with the spellReleases table
  async getAgentReleases(agentId: string) {
    const db = app.get('dbClient')
    const query = await db('spellReleases').where({ agentId })

    return { data: query }
  }

  async find(params?: ServiceParams) {
    return await this._find(params)
  }

  async update(id: string, data: AgentInterface, params?: ServiceParams) {
    // Call the original update method to handle other updates
    return this._update(id, data, params)
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

  /**
   * Creates a new spell release for the given agent by
   * creating a new spell release and then creating a new spell
   * for each spell in the project and giving it a spellReleaseId.
   * Then updates the agent with the new spell release ID.
   * @param agentId - The id of the agent to create a new spell release for.
   * @param versionTag - The version tag to give the new spell release.
   * @returns An object containing the id of the new spell release ID.
   */
  async createRelease({
    agentId,
    versionTag,
  }: {
    agentId: string
    versionTag: string
  }): Promise<{ spellReleaseId: string }> {
    try {
      // update current agent with reference to new version
      const agent = await app.service('agents').get(agentId, {})
      // // get all spells for the project
      const allSpells: SpellData[] = await fetchAllPages(
        app.service('spells').find.bind(app.service('spells')),
        {
          query: {
            projectId: agent.projectId,
          },
        }
      )

      const spellRelease = await app.service('spellReleases').create({
        versionName: versionTag,
        agentId,
      })

      // create new spell release for each spell
      await Promise.all(
        allSpells.map(async (spell: SpellData) => {
          return await app.service('spells').create({
            ...spell,
            id: uuidv4(),
            spellReleaseId: spellRelease.id,
            updatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            type: spell.type ?? 'spell',
          })
        })
      )

      // update agent with new spell release
      // TODO: id and name should not be required in the type
      await app.service('agents').patch(agentId, {
        currentSpellReleaseId: spellRelease.id,
        projectId: agent.projectId,
        id: agentId,
        name: agent.name,
      })

      return { spellReleaseId: spellRelease.id }
    } catch (error: any) {
      throw new Error(`Error in agents.class:createRelease: ${error.message}`)
    }
  }

  async create(
    data: AgentData | AgentData[] | any
  ): Promise<Agent | Agent[] | any> {
    // ADDING REST API KEY TO AGENT's DATA

    if (data.data) {
      data.data = JSON.stringify({
        ...(typeof data.data === 'string' ? JSON.parse(data.data) : data.data),
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

  async remove(agentId: string, params: ServiceParams) {
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
