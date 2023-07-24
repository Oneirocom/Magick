// DOCUMENTED
/**
 * This file configures the agent service with its hooks and utility functions.
 * For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
 */

// Import necessary modules and functions
import * as BullMQ from 'bullmq'
import { hooks as schemaHooks } from '@feathersjs/schema'
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
 * Configure the agent service by registering it, its hooks, and its options.
 * @param app - The Feathers application
 */
export const agent = (app: Application) => {
  // Register the agent service on the Feathers application
  app.use('agents', new AgentService(getOptions(app), app), {
    methods: ['find', 'get', 'create', 'patch', 'remove', 'run'],
    events: AGENT_EVENTS,
  })

  const pubSub = app.get<'pubsub'>('pubsub')

  // this handles relaying all agent messages up to connected clients.
  pubSub.patternSubscribe('agent*', (message, channel) => {
    // parse  the channel from agent:agentId:messageType
    const agentId = channel.split(':')[1]

    // parse the type of agent message
    const messageType = channel.split(':')[2]

    // check if message type is an agent event
    if (!AGENT_EVENTS.includes(messageType)) {
      // notify connected clients via log message that an unknown message type was received
      app.service('agents').emit('log', {
        channel,
        agentId,
        data: {
          message: `Unknown message type ${messageType}`,
        },
      })
    }

    // this is where we relay messages up based upon the time.
    // note for every custom type we need to add it to the above
    // todo harder typing on all message transports
    app.service('agents').emit(messageType, {
      ...message,
      messageType,
      channel,
      agentId,
    })
  })

  // todo more predictable channel names and method for handling message queues
  // similar to the above
  new BullMQ.Worker(
    'agent:run:result',
    async job => {
      // we wil shuttle this message from here back up a socket to the client
      const { agentId, projectId, originalData } = job.data
      // emit custom events via the agent service
      app.service('agents').emit('result', {
        channel: `agent:${agentId}`,
        sessionId: originalData.sessionId,
        projectId,
        data: job.data,
      })
    },
    {
      connection: app.get('redis'),
    }
  )

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
        async (context: HookContext) => {
          context.data.id = uuidv4()
          return context
        },
      ],
      patch: [
        schemaHooks.validateData(agentPatchValidator),
        schemaHooks.resolveData(agentPatchResolver),
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
