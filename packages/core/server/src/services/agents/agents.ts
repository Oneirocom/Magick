// DOCUMENTED
/**
 * This file configures the agent service with its hooks and utility functions.
 * For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
 */

// Import necessary modules and functions
import * as BullMQ from 'bullmq'
import { hooks as schemaHooks } from '@feathersjs/schema'
import { BadRequest } from '@feathersjs/errors'
import {
  agentDataValidator,
  agentPatchValidator,
  agentQueryValidator,
  agentResolver,
  agentExternalResolver,
  agentDataResolver,
  agentPatchResolver,
  agentQueryResolver,
  agentJsonFields,
} from './agents.schema'
import type { Application, HookContext } from '../../declarations'
import { AgentService, getOptions } from './agents.class'
import { jsonResolver } from '../utils'
import { v4 as uuidv4 } from 'uuid'

// Re-export agents.class and agents.schema
export * from './agents.class'
export * from './agents.schema'

/**
 * Validate that the rootSpell.id field is present.
 * @param context - The hook context
 */
const validateRootSpell = async (context: HookContext) => {
  if (
    context.data.enabled &&
    (!context.data.rootSpell || !context.data.rootSpell.id)
  ) {
    throw new BadRequest('Rootspell is required when agent is enabled')
  }
  return context
}

/**
 * Configure the agent service by registering it, its hooks, and its options.
 * @param app - The Feathers application
 */
export const agent = (app: Application) => {
  // Register the agent service on the Feathers application
  app.use('agents', new AgentService(getOptions(app), app), {
    methods: ['find', 'get', 'create', 'patch', 'remove', 'run'],
    events: ['log'],
  })

  const pubSub = app.get<'pubsub'>('pubsub')

  pubSub.patternSubscribe('agent*', (message, channel) => {
    // no point in subscribing to agent messages if we are an agent
    if (app.get('isAgent')) return
    console.log('**************RECEIVED AGENT MESSAGE', channel, message)

    // const regex = /agent:([a-z0-9\-]+)/
    // const match = channel.match(regex)
    // const agentId = match ? match[1] : null
    // console.log('AGENTID', agentId)
    // emit custom events via the agent service
    app.service('agents').emit('log', {
      channel,
      projectId: message?.projectId,
      data: message,
    })
  })

  const agentResultWorker = new BullMQ.Worker('agent:run:result', async job => {
    // no point in subscribing to agent messages if we are an agent
    if (app.get('isAgent')) return
    console.log('RESULT JOB RECEIVED!!!', job.id, job.data)
    // we wil shuttle this message from here back up a socket to the client
    const { agentId, projectId, result } = job.data
    // emit custom events via the agent service
    app.service('agents').emit('result', {
      channel: `agent:${agentId}`,
      projectId,
      data: result,
    })
  })

  // Initialize hooks for the agent service
  app.service('agents').hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(agentExternalResolver),
        schemaHooks.resolveResult(agentResolver),
        schemaHooks.resolveResult(jsonResolver(agentJsonFields)),
      ],
    },
    before: {
      all: [
        schemaHooks.validateQuery(agentQueryValidator),
        schemaHooks.resolveQuery(agentQueryResolver),
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(agentDataValidator),
        schemaHooks.resolveData(agentDataResolver),
        validateRootSpell,
        async (context: HookContext) => {
          context.data.id = uuidv4()
          return context
        },
      ],
      patch: [
        schemaHooks.validateData(agentPatchValidator),
        schemaHooks.resolveData(agentPatchResolver),
        validateRootSpell,
      ],
      update: [],
      remove: [],
    },
    after: {
      all: [],
    },
    error: {
      all: [],
    },
  })
}

// Add the agent service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    agents: AgentService
  }
}
