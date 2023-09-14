// DOCUMENTED
/**
 * For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
 */

// Import hooks from '@feathersjs/schema'
import { hooks as schemaHooks } from '@feathersjs/schema'

// Import API resolvers and validators
import {
  agentHttpDataResolver,
  agentHttpDataValidator,
  agentHttpExternalResolver,
  agentHttpQueryResolver,
  agentHttpQueryValidator,
  agentHttpResolver,
} from './agentHttp.schema'

// Import types and classes
import type { Application } from '@magickml/server-core'
import { AgentHttpService } from './agentHttp.class'

// Add this service to the service type index
declare module '@magickml/server-core' {
  interface ServiceTypes {
    [agentHttpPath]: AgentHttpService
  }
}

// Constants for API path and methods
export const agentHttpPath = 'api'
export const apiMethods = [
  'get',
  'create',
  'update',
  'delete',
  'patch',
] as const

// Export class and schema files
export * from './agentHttp.class'
export * from './agentHttp.schema'

/**
 * A configure function that registers the service and its hooks via `app.configure`
 * @param app - The Feathers application
 */
export const agentHttp = (app: Application) => {
  // Register our service on the Feathers application
  app.use(agentHttpPath, new AgentHttpService(), {
    // A list of all methods this service exposes externally
    // You can add additional custom events to be sent to clients here
    methods: ['get', 'create', 'update', 'remove'],
    events: [],
  })

  // Initialize hooks
  app.service(agentHttpPath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(agentHttpExternalResolver),
        schemaHooks.resolveResult(agentHttpResolver),
      ],
    },
    before: {
      get: [
        schemaHooks.validateQuery(agentHttpQueryValidator),
        schemaHooks.resolveQuery(agentHttpQueryResolver),
      ],
      update: [
        schemaHooks.validateData(agentHttpDataValidator),
        schemaHooks.resolveData(agentHttpDataResolver),
      ],
      create: [
        schemaHooks.validateData(agentHttpDataValidator),
        schemaHooks.resolveData(agentHttpDataResolver),
      ],
      remove: [
        schemaHooks.validateQuery(agentHttpQueryValidator),
        schemaHooks.resolveQuery(agentHttpQueryResolver),
      ],
    },
    after: {
      all: [],
    },
    error: {
      all: [],
    },
  } as any) // TODO: fix me
}
