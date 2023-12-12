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

  async find(params?: ServiceParams) {
    // Convert 'null' strings to null values
    if (params.query) {
      Object.keys(params.query).forEach(key => {
        if (params.query[key] === 'null') {
          params.query[key] = null
        }
      })
    }
    return await this._find(params)
  }

  async update(id: string, data: AgentInterface, params?: ServiceParams) {
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

  async createRelease({
    agentId,
    description,
    agentToCopyId,
  }: {
    agentId: string
    description: string
    agentToCopyId: string
  }): Promise<{ spellReleaseId: string }> {
    // Start a new transaction
    return this.app.get('dbClient').transaction(async trx => {
      try {
        const agentToUpdate = await trx('agents').where({ id: agentId }).first()
        const agentToCopy = await trx('agents')
          .where({ id: agentToCopyId })
          .first()
        if (!agentToUpdate || !agentToCopy)
          throw new Error(`Agent with id ${agentId} not found`)
        const projectId = agentToUpdate.projectId

        const [spellRelease] = await trx('spellReleases')
          .insert({
            id: uuidv4(),
            description: description || '',
            agentId: agentToUpdate.id,
            projectId,
          })
          .returning('*')

        // Fetch spells based on the source determined
        const allSpells: SpellData[] = await fetchAllPages(
          this.app.service('spells').find.bind(this.app.service('spells')),
          {
            query: {
              projectId,
              agentId: agentToCopy?.id,
            },
            transaction: trx,
          }
        )

        const draftSpellsToCopy = allSpells.filter(
          (spell: SpellData) => !spell.spellReleaseId
        )

        if (!draftSpellsToCopy.length)
          throw new Error('No spells found to copy')

        // Duplicate spells for the new release
        for (const spell of draftSpellsToCopy) {
          await trx('spells').insert({
            ...spell,
            id: uuidv4(),
            spellReleaseId: spellRelease.id,
            updatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            type: spell.type ?? 'spell',
          })
        }

        // Update agent with new spell release ID
        await trx('agents').where({ id: agentToUpdate.id }).update({
          currentSpellReleaseId: spellRelease.id,
          updatedAt: new Date().toISOString(),
        })

        return { spellReleaseId: spellRelease.id }
      } catch (error: any) {
        throw new Error(
          `Error in agents.class:createRelease: ${error?.message}`
        )
      }
    })
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
