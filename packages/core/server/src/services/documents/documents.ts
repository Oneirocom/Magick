// DOCUMENTED
import * as BullMQ from 'bullmq'
import { hooks as schemaHooks } from '@feathersjs/schema'
import pgvector from 'pgvector/pg'
import { Application, HookContext } from '../../declarations'
import { DOCUMENT_QUEUE, DocumentService, getOptions } from './documents.class'
import {
  documentPatchResolver,
  documentPatchValidator,
  documentQueryResolver,
  documentQueryValidator,
} from './documents.schema'
import { event } from '../events/events'

// Array with 1536 elements containing 0
const nullArray = new Array(1536).fill(0)

export * from './documents.class'
export * from './documents.schema'

/**
 * A configure function that registers the service and its hooks via `app.configure`.
 * @param app - The Feathers application.
 */
export const document = (app: Application) => {
  // Register our service on the Feathers application
  app.use('documents', new DocumentService(getOptions(app)), {
    methods: ['find', 'get', 'create', 'patch', 'remove'],
    events: ['finished', 'progress'],
  })

  if (app.get('environment') === 'server') {
    // Set up document queue to process document jobs
    const worker = new BullMQ.Worker(DOCUMENT_QUEUE, async job => {
      const { data } = await app
        .service('documents')
        .createWorker(job.data, job)
      return data
    })

    // event queues to send events to the client
    const eventQueue = new BullMQ.QueueEvents(DOCUMENT_QUEUE)

    eventQueue.on('completed', (jobId, returnvalue) => {
      console.log('DOCUMENT COMPLETED', jobId, returnvalue)
      app.service('documents').emit('finished', { jobId, returnvalue })
    })

    eventQueue.on('progress', (jobId, progress) => {
      console.log('progress', jobId, progress)
      app.service('documents').emit('progress', { jobId, progress })
    })
  }

  // Initialize hooks
  app.service('documents').hooks({
    around: {
      all: [
        /* schemaHooks.resolveExternal(documentExternalResolver),
        schemaHooks.resolveResult(documentResolver), */
      ],
    },
    before: {
      all: [
        schemaHooks.validateQuery(documentQueryValidator),
        schemaHooks.resolveQuery(documentQueryResolver),
      ],
      find: [],
      get: [],
      // Optimize the create operation
      create: [
        // feathers hook to get the 'embedding' field from the request and make sure it is a valid pgvector (cast all to floats)
        async (context: HookContext) => {
          let { embedding } = context.data

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
      patch: [
        schemaHooks.validateData(documentPatchValidator),
        schemaHooks.resolveData(documentPatchResolver),
      ],
      remove: [],
    },
    after: {
      create: [
        // Commented out because it is not being used currently
        // async (context: HookContext) => {
        //   if (!context.data.embedding || context.data.embedding.length === 0)
        //     return context;
        //   const { id } = context.result;
        //   ...
        // },
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
