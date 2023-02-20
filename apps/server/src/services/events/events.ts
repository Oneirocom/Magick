
//@ts-nocheck
// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'
import {
  DATABASE_URL,
  ANALYTICS_ENDPOINT
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
  console.log(users)
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
      find:[
        async (context: any) => {
          if (context.params.query.embedding){
            console.log("FIND")
            console.log('context.params.query.embedding', context.params.query.embedding)
            let blob = atob( context.params.query.embedding );
            let ary_buf = new ArrayBuffer( blob.length );
            let dv = new DataView( ary_buf );
            for( let i=0; i < blob.length; i++ ) dv.setUint8( i, blob.charCodeAt(i) );
            let f32_ary = new Float32Array( ary_buf );
            console.log( f32_ary );
            let temp = await getUsersOver("["+f32_ary+"]")
            return {
              "result" : temp
            }
          }
          
        }
      ],
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
      all: [
        // re-send the request to the ANALYTICS_ENDPOINT
        async (context: any) => {
          if(!ANALYTICS_ENDPOINT) return
          const { method, data, params } = context
          // send a POST to ANALYTICS_ENDPOINT with the data
          fetch(ANALYTICS_ENDPOINT, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              method,
              data,
              params
            })
          })
        } 
      ]
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
