// DOCUMENTED
// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { Agent, AgentData, AgentPatch, AgentQuery } from './agents.schema'
import { Queue } from 'bullmq'
import { bullMQConnection } from '@magickml/core'

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
  runQueue: Queue

  constructor(options: KnexAdapterOptions, app: Application) {
    super(options)
    this.app = app
    this.runQueue = new Queue(`agent:run`, {
      connection: bullMQConnection
    })
  }

  async run(data: AgentRunData) {
    if (!data.agentId) throw new Error('agentId is required')
    // probably need to authenticate the request here against project id
    // add the job to the queueD
    const job = await this.runQueue.add(data.agentId, {
      ...data,
    })

    // return the job id
    return { jobId: job.id }
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
  }
}
