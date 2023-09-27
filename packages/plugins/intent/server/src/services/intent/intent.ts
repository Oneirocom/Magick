// DOCUMENTED
/**
 * For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
 */

// Import hooks from '@feathersjs/schema'
import { hooks as schemaHooks } from '@feathersjs/schema'

// Import Intent resolvers and validators
import { intentQueryResolver, intentQueryValidator } from './intent.schema'
import { v4 as uuidv4 } from 'uuid'
import pgvector from 'pgvector/pg'
// Import types and classes
import {
  checkPermissions,
  type Application,
  type HookContext,
} from 'server/core'
import { IntentService, getOptions } from './intent.class'

// Array with 1536 elements containing 0
const nullArray = new Array(1536).fill(0)

// Add this service to the service type index
declare module 'server/core' {
  interface ServiceTypes {
    [intentPath]: IntentService
  }
}

// Constants for Intent path and methods
export const intentPath = 'intents'
export const intentMethods = ['create'] as const

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
        // schemaHooks.resolveExternal(intentExternalResolver),
        // schemaHooks.resolveResult(intentResolver),
      ],
    },
    before: {
      all: [
        checkPermissions({
          roles: ['owner', 'agent'],
        }),
        schemaHooks.validateQuery(intentQueryValidator),
        schemaHooks.resolveQuery(intentQueryResolver),
      ],
      create: [
        async (context: HookContext) => {
          let { embedding } = context.data
          const { data, service } = context
          const id = uuidv4()
          //Add UUID for events.
          context.data = {
            [service.id]: id,
            ...data,
          }

          // if embedding is not null and not null array, then cast to pgvector
          if (embedding && embedding.length > 0 && embedding[0] !== 0) {
            if (typeof embedding == 'string') embedding = JSON.parse(embedding)
            context.data.embedding = pgvector.toSql(embedding)
            return context
          } else {
            context.data.embedding = pgvector.toSql(nullArray)
            return context
          }
        },
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
