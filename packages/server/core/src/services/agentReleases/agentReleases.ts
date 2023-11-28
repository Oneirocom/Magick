// DOCUMENTED
/**
 * This file configures the agentReleases service with its hooks and utility functions.
 * For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
 */

// Import necessary modules and functions
import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  agentReleaseDataValidator,
  agentReleasePatchValidator,
  agentReleaseQueryValidator,
  agentReleaseResolver,
  agentReleaseExternalResolver,
  agentReleaseDataResolver,
  agentReleasePatchResolver,
  agentReleaseQueryResolver,
  agentReleaseJsonFields,
} from './agentReleases.schema'
import type { Application, HookContext } from '../../declarations'
import { AgentReleasesService, getOptions } from './agentReleases.class'
import { jsonResolver } from '../utils'
import { v4 as uuidv4 } from 'uuid'
import { checkPermissions } from '../../lib/feathersPermissions'

// Re-export agentReleases.class and agents.schema
export * from './agentReleases.class'
export * from './agentReleases.schema'

function removeUnwantedProperties(obj: any, keysToRemove: string[]): any {
  // Base cases
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  // For arrays, iterate over each item
  if (Array.isArray(obj)) {
    return obj.map(item => removeUnwantedProperties(item, keysToRemove))
  }

  // Create a new object without the unwanted properties
  const result: any = {}
  for (const key of Object.keys(obj)) {
    if (!keysToRemove.includes(key)) {
      result[key] = removeUnwantedProperties(obj[key], keysToRemove)
    }
  }

  return result
}

const AGENT_EVENTS = ['log', 'result', 'spell', 'run', 'command']

/**
 * Configure the agentReleases service by registering it, its hooks, and its options.
 * @param app - The Feathers application
 */
export const agentReleases = (app: Application) => {
  // Register the agentReleases service on the Feathers application
  app.use('agentReleases', new AgentReleasesService(getOptions(app), app), {
    methods: [
      'find',
      'get',
      'create',
      'remove',
    ],
    events: AGENT_EVENTS,
  })


  const pubSub = app.get<'pubsub'>('pubsub')

  // Initialize hooks for the agentReleases service
  app.service('agentReleases').hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(agentReleaseExternalResolver),
        schemaHooks.resolveResult(agentReleaseResolver),
        schemaHooks.resolveResult(jsonResolver(agentReleaseJsonFields)),
      ],
    },
    before: {
      all: [
        checkPermissions({
          roles: ['owner'],
        }),
        schemaHooks.validateQuery(agentReleaseQueryValidator),
        schemaHooks.resolveQuery(agentReleaseQueryResolver),
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(agentReleaseDataValidator),
        schemaHooks.resolveData(agentReleaseDataResolver),
        async (context: HookContext) => {
          context.data.id = uuidv4()
          return context
        },
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

// add the AgentRelease service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    agentReleases: AgentReleasesService
    '/agentReleases/createRelease': {
      create: ReturnType<any>
    }
  }
}
