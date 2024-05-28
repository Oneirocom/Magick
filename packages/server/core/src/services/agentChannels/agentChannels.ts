// Import necessary modules and functions
import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  agentChannelDataValidator,
  agentChannelPatchValidator,
  agentChannelQueryValidator,
  agentChannelResolver,
  agentChannelExternalResolver,
  agentChannelDataResolver,
  agentChannelPatchResolver,
  agentChannelQueryResolver,
  agentChannelJsonFields,
} from './agentChannels.schema'
import type { Application, HookContext } from '../../declarations'
import { AgentChannelsService, getOptions } from './agentChannels.class'
import { jsonResolver } from '../utils'
import { v4 as uuidv4 } from 'uuid'
import { checkPermissions } from '../../lib/feathersPermissions'

// Re-export agentChannels.class and agentChannels.schema
export * from './agentChannels.class'
export * from './agentChannels.schema'

/**
 * Configure the agent channel service by registering it, its hooks, and its options.
 * @param app - The Feathers application
 */
export const agentChannel = (app: Application) => {
  // Register the agent channel service on the Feathers application
  app.use('agentChannels', new AgentChannelsService(getOptions(app), app), {
    methods: [
      'find',
      'get',
      'create',
      'patch',
      'remove',
      'toggleChannel',
      'getChannels',
    ],
    events: [],
  })

  // Initialize hooks for the agent channel service
  app.service('agentChannels').hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(agentChannelExternalResolver),
        schemaHooks.resolveResult(agentChannelResolver),
        schemaHooks.resolveResult(jsonResolver(agentChannelJsonFields)),
      ],
    },
    before: {
      all: [
        checkPermissions({
          roles: ['owner', 'agent'],
        }),
        schemaHooks.validateQuery(agentChannelQueryValidator),
        schemaHooks.resolveQuery(agentChannelQueryResolver),
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(agentChannelDataValidator),
        schemaHooks.resolveData(agentChannelDataResolver),
        async (context: HookContext) => {
          context.data.id = uuidv4()
          return context
        },
      ],
      patch: [
        schemaHooks.validateData(agentChannelPatchValidator),
        schemaHooks.resolveData(agentChannelPatchResolver),
      ],
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

// Add the agent channel service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    agentChannels: AgentChannelsService
  }
}
