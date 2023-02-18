
//@ts-nocheck
// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'
import {
  DATABASE_URL
} from '@magickml/engine'
import pgvector from 'pgvector/pg'
import postgres from 'postgres'
import { hooks as schemaHooks } from '@feathersjs/schema' 
const sql = postgres(DATABASE_URL)
async function getUsersOver(embedding) {
  var users
  try {
    users = await sql`
    select * from events order by embedding <-> ${embedding} limit 1;`
  } catch (e){
    console.log(e)
  }
  return users
}
  

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

import type { Application, HookContext } from '../../declarations'
import { EventService, getOptions } from './events.class'

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
        schemaHooks.resolveExternal(eventExternalResolver),
        schemaHooks.resolveResult(eventResolver),
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(eventQueryValidator), schemaHooks.resolveQuery(eventQueryResolver)],
      find: [],
      get: [
        (context: any) => {
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
        (context: any) => {
          const { embedding } = context.data
          // if embedding is not null and not null array, then cast to pgvector
          if( embedding && embedding.length > 0 && embedding[0] !== 0 ) {
            context.data.embedding = pgvector.toSql(embedding)
          } else {
            context.data.embedding = pgvector.toSql(nullArray)
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
          async (context: any) => {
            if (!(context.params.query.embedding)){
              try {
                const query = context.service.createQuery(context.params)
                const cQuery = context.params.query;
                Object.keys(cQuery).map(key => {
                  query[key] = cQuery[key];
                });
                context.params.query = query;
              } catch (e){
                console.log(e)
              }
            } else {
              console.log("FIND")
              let undecoded_array = JSON.parse(context.params.query.embedding)
              let embedding_array = undecoded_array.map(element => {
                  return element/100000.0
              })
              let temp = await getUsersOver("["+embedding_array+"]")
              return {
                "result" : temp
              }
            }
            
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
