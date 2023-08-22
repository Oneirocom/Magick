// DOCUMENTED
/**
 * For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
 */

// Import hooks from '@feathersjs/schema'
import { hooks as schemaHooks } from '@feathersjs/schema'

// Import API resolvers and validators
import {
  apiDataResolver,
  apiDataValidator,
  apiExternalResolver,
  apiQueryResolver,
  apiQueryValidator,
  apiResolver,
} from './api.schema'

// Import types and classes
import type { Application } from '@magickml/server-core'
import { ApiService } from './api.class'

// Add this service to the service type index
declare module '@magickml/server-core' {
  interface ServiceTypes {
    [apiPath]: ApiService
  }
}

// Constants for API path and methods
export const apiPath = 'api'
export const apiMethods = [
  'get',
  'create',
  'update',
  'delete',
  'patch',
] as const


// Export class and schema files
export * from './api.class'
export * from './api.schema'

/**
 * A configure function that registers the service and its hooks via `app.configure`
 * @param app - The Feathers application
 */
export const api = (app: Application) => {
  // Register our service on the Feathers application
  app.use(apiPath, new ApiService(), {
    // A list of all methods this service exposes externally
    // You can add additional custom events to be sent to clients here
    methods: ['find', 'create', 'update', 'remove'],
    events: [],
  })

  // Initialize hooks
  app.service(apiPath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(apiExternalResolver),
        schemaHooks.resolveResult(apiResolver),
      ],
    },
    before: {
      all: [
        // get agent
        async (context) => {
          context.params.agent = await app
            .service('agents')
            .get(context.params.query.agentId)
          if (!context.params.agent) {
            throw new Error('Invalid Agent ID')
          }

          if (!context.params.agent.data.rest_enabled) {
            throw new Error('Agent does not have REST API enabled')
          }
        },
        // check apiKey
        async context => {
          const apiKey = context.params.query.apiKey

          if (apiKey !== context.params.agent.data.rest_api_key) {
            throw new Error('Invalid API Key')
          }
        },
        schemaHooks.validateQuery(apiQueryValidator),
        schemaHooks.resolveQuery(apiQueryResolver),
      ],
      get: [],
      update: [
        schemaHooks.validateData(apiDataValidator),
        schemaHooks.resolveData(apiDataResolver),
      ],
      create: [
        schemaHooks.validateData(apiDataValidator),
        schemaHooks.resolveData(apiDataResolver),
      ],
      remove: [],
    },
    after: {
      all: [],
    },
    error: {
      all: [],
    },
  } as any) // TODO: fix me
}
