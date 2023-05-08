// DOCUMENTED
/**
 * This file configures the agent service with its hooks and utility functions.
 * For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
 */

// Import necessary modules and functions
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
  app.use('agents', new AgentService(getOptions(app)), {
    methods: ['find', 'get', 'create', 'patch', 'remove', 'log'],
    events: [],
  })

  app.service('agents').publish((data: any, context) => {
    const projectIds = new Set<string>()
    // Loop through each object in the data array and add its projectId to the set
    if (Array.isArray(data)) {
      for (const item of data) {
        if (item && item.projectId) {
          projectIds.add(item.projectId)
        }
      }
    } else if (data && data?.projectId) {
      // If data is a single object with a projectId property, add the projectId to the set
      projectIds.add(data?.projectId)
    }

    // Return the channels for each projectId in the set
    const channels = Array.from(projectIds).map(projectId =>
      app.channel(projectId)
    )

    return channels.length > 0 ? channels : null
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
