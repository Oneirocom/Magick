// DOCUMENTED
import { hooks as schemaHooks } from '@feathersjs/schema'
import pgvector from 'pgvector/pg'
import { v4 as uuidv4 } from 'uuid'
import {
  eventExternalResolver,
  eventPatchResolver,
  eventPatchValidator,
  eventQueryResolver,
  eventQueryValidator,
  eventResolver,
} from './events.schema'

import { Application, HookContext } from '../../declarations'
import { EventService, getOptions } from './events.class'
import { checkPermissions } from '../../lib/feathersPermissions'

/**
 * Export the Event class and event schema
 */
export * from './events.class'
export * from './events.schema'

// Null array with 1536 values
const nullArray = new Array(1536).fill(0)

/**
 * A configure function that registers the service and its hooks via `app.configure`
 * @param app {Application}
 */
export const event = (app: Application) => {
  // Register our service on the Feathers application
  app.use('events', new EventService(getOptions(app)), {
    methods: ['find', 'get', 'create', 'patch', 'remove'],
    events: [],
  })

  // Initialize hooks

  app.service('events').hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(eventExternalResolver),
        schemaHooks.resolveResult(eventResolver),
      ],
    },
    before: {
      all: [
        checkPermissions({
          roles: ['owner', 'events'],
        }),
        schemaHooks.validateQuery(eventQueryValidator),
        schemaHooks.resolveQuery(eventQueryResolver),
      ],
      find: [],
      get: [
        (context: HookContext) => {
          const { getEmbedding } = context.params.query
          if (getEmbedding) {
            context.params.query.$limit = 1
            context.params.query.embedding = { $ne: pgvector.toSql(nullArray) }
          }
          return context
        },
      ],
      create: [
        // feathers hook to get the 'embedding' field from the request and make sure it is a valid pgvector (cast all to floats)
        async (context: HookContext) => {
          const { embedding } = context.data
          const { data, service } = context
          const id = uuidv4()
          //Add UUID for events.
          context.data = {
            [service.id]: id,
            ...data,
          }
          // if embedding is not null and not null array, then cast to pgvector
          if (embedding && embedding.length > 0 && embedding[0] !== 0) {
            context.data.embedding = pgvector.toSql(embedding as Array<number>)
            return context
          } else {
            context.data.embedding = pgvector.toSql(nullArray)
            //context.app.service('events').create(context.data);
            return context
          }
          return
        },
      ],
      patch: [
        schemaHooks.validateData(eventPatchValidator),
        schemaHooks.resolveData(eventPatchResolver),
      ],
      remove: [],
    },
    after: {
      create: [],
      all: [],
    },
    error: {
      all: [],
    },
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    events: EventService
  }
}
