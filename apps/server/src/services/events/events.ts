// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'
import pgvector from 'pgvector/pg'
import postgres from 'postgres'
import { hooks as schemaHooks } from '@feathersjs/schema' 
const sql = postgres(process.env.DATABASE_URL)
async function getUsersOver(embedding) {
  const users = await sql`
    select * from events order by embedding <-> ${embedding} limit 1;`
  return users
}

import {
  eventDataValidator,
  eventPatchValidator,
  eventQueryValidator,
  eventResolver,
  eventExternalResolver,
  eventDataResolver,
  eventPatchResolver,
  eventQueryResolver
} from './events.schema'

import type { Application, HookContext } from '../../declarations'
import { EventService, getOptions } from './events.class'
import { makeEmbedding } from 'packages/engine/src/functions/makeEmbedding'

export * from './events.class'
export * from './events.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const event = (app: Application) => {
  // Register our service on the Feathers application
  app.use('events', new EventService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: ['find', 'get', 'create', 'patch', 'remove'],
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service('events').hooks({
    around: {
      all: [
        // process.env.USE_AUTH !== 'true' && process.env.NODE_ENV === 'development' ? authenticate('jwt') : (context: any, next: any) => next(),
        schemaHooks.resolveExternal(eventExternalResolver),
        schemaHooks.resolveResult(eventResolver),
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(eventQueryValidator), schemaHooks.resolveQuery(eventQueryResolver)],
      find: [],
      get: [],
      create: [
        // feathers hook to get the 'embedding' field from the request and make sure it is a valid pgvector (cast all to floats)
        (context: any) => {
          const { embedding } = context.data
          if( embedding ) {
            context.data.embedding = pgvector.toSql(embedding)
          }
          return context
        },
        schemaHooks.validateData(eventDataValidator), schemaHooks.resolveData(eventDataResolver)],
      patch: [schemaHooks.validateData(eventPatchValidator), schemaHooks.resolveData(eventPatchResolver)],
      remove: []
    },
    after: {
      create:[

      ],
      find:[
          async (context: HookContext) => {
            //let embed = await makeEmbedding({input: context.params.query.content})

            //let temp = await getUsersOver("["+embed.data[0].embedding+"]")
            return context.params.query.embedding
          }
        ],
      all: []
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    events: EventService
  }
}
