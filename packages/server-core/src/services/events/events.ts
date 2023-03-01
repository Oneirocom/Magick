
//@ts-nocheck
// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'
import pgvector from 'pgvector/pg'
import type { Knex } from 'knex'
import { hooks as schemaHooks } from '@feathersjs/schema'   

// array 1536 values in length
const nullArray = new Array(1536).fill(0)

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

import { Application, HookContext } from '../../declarations'
import { EventService, getOptions } from './events.class'
import { dbDialect, SupportedDbs } from '../../dbClient'

export * from './events.class'
export * from './events.schema'

async function findSimilarEventByEmbedding(db: Knex, embedding) {
  const query: Record<SupportedDbs, Knex.QueryBuilder> = {
    [SupportedDbs.pg]: async () => await db.raw(`select * from events order by embedding <-> ${embedding} limit 1;`),
    [SupportedDbs.sqlite3]: async () => {
      const eventInVssTable = await db.raw(
        `select rowid, distance from vss_events
         where vss_search(
            event_embedding, 
            vss_search_params(
              ${embedding},
              1
            )
          )
        ;`
      )
      if (!eventInVssTable?.rowid) return null
      const event = await db('events').where('id', eventInVssTable.rowid).first()
      return event
    }
  }
  try {
    embeddings = await query[dbDialect]()
  } catch (e){
    console.log(e)
  }
  console.log(embeddings)
  return embeddings
}

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
      find:[
        async (context: HookContext) => {
          if (context.params.query.embedding){
            const blob = atob( context.params.query.embedding );
            const ary_buf = new ArrayBuffer( blob.length );
            const dv = new DataView( ary_buf );
            for( let i=0; i < blob.length; i++ ) dv.setUint8( i, blob.charCodeAt(i) );
            const f32_ary = new Float32Array( ary_buf );
            const result = await findSimilarEventByEmbedding(db, "["+f32_ary+"]")
            return { result }
          }
          
        }
      ],
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
          if( embedding && embedding.length > 0 && embedding[0] !== 0 ) {
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
      create:[
        async (context: HookContext) => {
          const { id } = context.result
          // store the data in the virtual vss table
          if (dbDialect === SupportedDbs.sqlite3) {
            await db.raw(`
              insert into vss_events(rowid, event_embedding) 
              select id, embedding from events where id = ${id};
            `)
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
