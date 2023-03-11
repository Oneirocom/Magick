import { hooks as schemaHooks } from '@feathersjs/schema'
import type { Knex } from 'knex'
import os from 'os'
import pgvector from 'pgvector/pg'
const cpuCore = os.cpus()
const isM1 = cpuCore[0].model.includes("Apple M1") || cpuCore[0].model.includes("Apple M2")
const isWindows = os.platform() === 'win32'

// get 

// array 1536 values in length
const nullArray = new Array(1536).fill(0)

import {
  eventDataResolver, eventDataValidator, eventExternalResolver, eventPatchResolver, eventPatchValidator, eventQueryResolver, eventQueryValidator,
  eventResolver
} from './events.schema'

import { dbDialect, SupportedDbs } from '../../dbClient'
import { Application, HookContext } from '../../declarations'
import { EventService, getOptions } from './events.class'

export * from './events.class'
export * from './events.schema'


// A configure function that registers the service and its hooks via `app.configure`
export const event = (app: Application) => {
  const db = app.get('dbClient')
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
        schemaHooks.resolveExternal(eventExternalResolver),
        schemaHooks.resolveResult(eventResolver),
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(eventQueryValidator), schemaHooks.resolveQuery(eventQueryResolver)],
      find: [],
      get: [
        (context: HookContext) => {
          const { getEmbedding } = context.params.query
          if (getEmbedding) {
            context.params.query.$limit = 1
            context.params.query.embedding = { $ne: pgvector.toSql(nullArray) }
          }
          return context
        }
      ],
      create: [
        // feathers hook to get the 'embedding' field from the request and make sure it is a valid pgvector (cast all to floats)
        (context: HookContext) => {
          const { embedding } = context.data
          // if embedding is not null and not null array, then cast to pgvector
          if (embedding && embedding.length > 0 && embedding[0] !== 0) {
            context.data.embedding = pgvector.toSql(embedding)
          } else {
            context.data.embedding = pgvector.toSql(nullArray)
          }
          return context
        },
        schemaHooks.validateData(eventDataValidator), schemaHooks.resolveData(eventDataResolver)
      ],
      patch: [schemaHooks.validateData(eventPatchValidator), schemaHooks.resolveData(eventPatchResolver)],
      remove: []
    },
    after: {
      create: [
        async (context: HookContext) => {
          if (!context.data.embedding || context.data.embedding.length === 0) return context
          const { id } = context.result
          // store the data in the virtual vss table
          if (dbDialect === SupportedDbs.sqlite && !isM1 && !isWindows) {
            try {
              await db.raw(`
                insert into vss_events(rowid, event_embedding)
                select id, embedding from events where id = ${id};
              `)
            } catch (error) {
              console.error('after event created error, sqlite', error)
            }
          }
          return context
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
