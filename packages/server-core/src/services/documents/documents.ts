import { hooks as schemaHooks } from '@feathersjs/schema'
import { SKIP_DB_EXTENSIONS } from '@magickml/engine'
import os from 'os'
import pgvector from 'pgvector/pg'
import { v4 as uuidv4 } from 'uuid'

// array 1536 values in length
const nullArray = new Array(1536).fill(0)

import {
  documentDataResolver,
  documentDataValidator,
  documentExternalResolver,
  documentPatchResolver,
  documentPatchValidator,
  documentQueryResolver,
  documentQueryValidator,
  documentResolver
} from './documents.schema'

import { Application, HookContext } from '../../declarations'
import { DocumentService, getOptions } from './documents.class'

export * from './documents.class'
export * from './documents.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const document = (app: Application) => {
  // Register our service on the Feathers application
  app.use('documents', new DocumentService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: ['find', 'get', 'create', 'patch', 'remove'],
    // You can add additional custom documents to be sent to clients here
    events: [],
  })
  // Initialize hooks
  app.service('documents').hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(documentExternalResolver),
        schemaHooks.resolveResult(documentResolver),
      ],
    },
    before: {
      all: [
        schemaHooks.validateQuery(documentQueryValidator),
        schemaHooks.resolveQuery(documentQueryResolver),
      ],
      find: [],
      get: [
        (context: HookContext) => {
          if (SKIP_DB_EXTENSIONS) return context
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
          if (SKIP_DB_EXTENSIONS) return context
          const { embedding } = context.data
          const { data, service } = context
          let id = uuidv4()
          //Add UUID for events.
          context.data = {
            [service.id]: id,
            ...data,
          }
          // if embedding is not null and not null array, then cast to pgvector
          if (embedding && embedding.length > 0 && embedding[0] !== 0) {
            if (process.env.DATABASE_TYPE == "pg") {
              console.log(embedding as Array<number>)
              console.log(typeof(embedding as Array<number>))
              context.data.embedding = pgvector.toSql(embedding as Array<number>)  
              return context;
            }else{
              const docdb = app.get('vectordb')
              let insert_data = [{
                embedding: embedding,
                data: {
                  metadata: {...context.data} || {"msg": "Empty Data"},
                  pageContent: context.data['content'] || "No Content in the Event",
                },
              }]
              await docdb.addEmbeddingsWithData(insert_data);
            }      
          } else {
            if (process.env.DATABASE_TYPE == "pg") {
              context.data.embedding = pgvector.toSql(nullArray)
              context.app.service('events').create(context.data);
              return context;
            } else {
              const docdb = app.get('docdb')
              let insert_data = [{
                embedding: nullArray,
                data: {
                  metadata: {...context.data} || {"msg": "Empty Data"},
                  pageContent: context.data['content'] || "No Content in the Event",
                },
              }]
              await docdb.addEmbeddingsWithData(insert_data);
            }
          }
          return;
        },
      ],
      patch: [
        schemaHooks.validateData(documentPatchValidator),
        schemaHooks.resolveData(documentPatchResolver),
      ],
      remove: [],
    },
    after: {
      create: [
        /* async (context: HookContext) => {
          if (SKIP_DB_EXTENSIONS) return context
          if (!context.data.embedding || context.data.embedding.length === 0)
            return context
          const { id } = context.result
          // store the data in the virtual vss table
          if (dbDialect === SupportedDbs.sqlite) {
            if (isM1 || isWindows) {
              console.warn(
                'Could not load VSS extension, you may want to set SKIP_DB_EXTENSIONS to true in your .env'
              )
              return context
            }
            try {
              await db.raw(`
                insert into vss_documents(rowid, document_embedding)
                select id, embedding from documents where id = ${id};
              `)
            } catch (error) {
              console.error('after document created error, sqlite', error)
            }
          }
          return context
        }, */
      ],
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
    documents: DocumentService
  }
}
