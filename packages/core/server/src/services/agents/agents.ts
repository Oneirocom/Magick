// DOCUMENTED
/**
 * This file configures the agent service with its hooks and utility functions.
 * For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
 */

// Import necessary modules and functions
const checkPermissions = require('feathers-permissions')
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

const AGENT_EVENTS = ['log', 'result', 'spell', 'run']

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
    if (app.get('isAgent')) return
    // parse  the channel from agent:agentId:messageType
    const agentId = channel.split(':')[1]

    // parse the type of agent message
    const messageType = channel.split(':')[2]

    console.log('EMITTING TYPE', messageType)

    // check if message type is an agent event
    if (!AGENT_EVENTS.includes(messageType)) {
      // notify connected clients via log message that an unknown message type was received
      app.service('agents').emit('log', {
        channel,
        agentId,
        project: agentId,
        data: {
          message: `Unknown message type ${messageType} on channel ${channel}`,
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
        checkPermissions({
          roles: ['owner', 'agent'],
        }),
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
