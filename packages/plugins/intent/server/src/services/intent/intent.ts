// DOCUMENTED
/**
 * For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
 */

// Import hooks from '@feathersjs/schema'
import { hooks as schemaHooks } from '@feathersjs/schema'

// Import Intent resolvers and validators
import {
  intentDataResolver,
  intentDataValidator,
  intentExternalResolver,
  intentQueryResolver,
  intentQueryValidator,
  intentResolver,
} from './intent.schema'

// Import types and classes
import type { Application } from '@magickml/server-core'
import { IntentService, getOptions } from './intent.class'

// Add this service to the service type index
declare module '@magickml/server-core' {
  interface ServiceTypes {
    [intentPath]: IntentService
  }
}

// Constants for Intent path and methods
export const intentPath = 'intent'
export const intentMethods = ['get', 'create', 'remove'] as const

// Export class and schema files
export * from './intent.class'
export * from './intent.schema'

/**
 * A configure function that registers the service and its hooks via `app.configure`
 * @param app - The Feathers application
 */
export const intent = (app: Application) => {
  // Register our service on the Feathers application
  app.use(intentPath, new IntentService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: intentMethods,
    // You can add additional custom events to be sent to clients here
    events: [],
  })

  // Initialize hooks
  app.service(intentPath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(intentExternalResolver),
        schemaHooks.resolveResult(intentResolver),
      ],
    },
    before: {
      all: [
        schemaHooks.validateQuery(intentQueryValidator),
        schemaHooks.resolveQuery(intentQueryResolver),
      ],
      get: [],
      update: [
        schemaHooks.validateData(intentDataValidator),
        schemaHooks.resolveData(intentDataResolver),
      ],
      create: [
        schemaHooks.validateData(intentDataValidator),
        schemaHooks.resolveData(intentDataResolver),
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
