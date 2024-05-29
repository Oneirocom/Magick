import type { Params } from '@feathersjs/feathers'
import { KnexAdapter } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'
import type { Application } from '../../declarations'
import { BadRequest, NotAuthenticated, NotFound } from '@feathersjs/errors'
import {
  AgentChannel,
  AgentChannelData,
  AgentChannelPatch,
  AgentChannelQuery,
} from './agentChannels.schema'

// Define AgentChannelParams type based on KnexAdapterParams with AgentChannelQuery
export type AgentChannelParams = KnexAdapterParams<AgentChannelQuery>

/**
 * Default AgentChannelsService class.
 * Calls the standard Knex adapter service methods but can be customized with your own functionality.
 *
 * @template ServiceParams - The input params for the service
 * @extends KnexService
 */
export class AgentChannelsService<
  ServiceParams extends Params = AgentChannelParams
> extends KnexAdapter<
  AgentChannel,
  AgentChannelData,
  ServiceParams,
  AgentChannelPatch
> {
  app: Application

  constructor(options: KnexAdapterOptions, app: Application) {
    super(options)
    this.app = app
  }

  async authorizeAgentPermissions(agentId: string, params?: ServiceParams) {
    if (!agentId) {
      console.error('agentId is required, Received null or undefined')
      throw new BadRequest('agentId is required')
    }
    const agent = await this.app.service('agents').get(agentId, params)
    if (!agent) throw new NotFound('Agent not found')
    const projectId = agent.projectId
    if (params?.provider) {
      if (agent.projectId !== projectId) {
        console.error(
          'Agent does not belong to the project',
          projectId,
          agentId
        )
        throw new NotAuthenticated("You don't have access to this agent")
      }
    }
  }

  async get(id: string, params?: ServiceParams) {
    console.log('GET')
    return await this._get(id, params)
  }

  async find(params?: ServiceParams) {
    console.log('FIND')
    return await this._find(params)
  }

  async create(data: AgentChannelData, params?: ServiceParams) {
    return await this._create(data, params)
  }

  async patch(id: string, data: AgentChannelPatch, params?: ServiceParams) {
    return await this._patch(id, data, params)
  }

  async remove(id: string, params?: ServiceParams) {
    return await this._remove(id, params)
  }

  async toggleChannel(
    id: string,
    data: { channelActive: boolean },
    params?: ServiceParams
  ) {
    const channel = await this._get(id, params)
    channel.channelActive = data.channelActive
    return this._patch(id, { channelActive: data.channelActive }, params)
  }

  async getChannels(agentId: string, params?: ServiceParams) {
    console.log('GET CHANNELS')
    await this.authorizeAgentPermissions(agentId, params)
    return this._find({
      query: {
        agentId,
      },
      ...params,
    })
  }
}

/**
 * Returns options needed to initialize the AgentChannelsService.
 *
 * @param app - the Feathers application
 * @returns KnexAdapterOptions - options for initializing the Knex adapter
 */
export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    name: 'agentChannels',
    multi: ['remove', 'patch'],
    Model: app.get('dbClient'),
  }
}
