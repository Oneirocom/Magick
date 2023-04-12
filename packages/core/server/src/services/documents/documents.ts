// DOCUMENTED 
import { hooks as schemaHooks } from '@feathersjs/schema';
import pgvector from 'pgvector/pg';
import { v4 as uuidv4 } from 'uuid';
// Array with 1536 elements containing 0
const nullArray = new Array(1536).fill(0);

import {
  documentDataResolver,
  documentDataValidator,
  documentExternalResolver,
  documentPatchResolver,
  documentPatchValidator,
  documentQueryResolver,
  documentQueryValidator,
  documentResolver
} from './documents.schema';

import { Application, HookContext } from '../../declarations';
import { DocumentService, getOptions } from './documents.class';

export * from './documents.class';
export * from './documents.schema';

/**
 * A configure function that registers the service and its hooks via `app.configure`.
 * @param app - The Feathers application.
 */
export const document = (app: Application) => {
  // Register our service on the Feathers application
  app.use('documents', new DocumentService(getOptions(app)), {
    methods: ['find', 'get', 'create', 'patch', 'remove'],
    events: [],
  });

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
      get: [
        (context: HookContext) => {
          const { getEmbedding } = context.params.query;
          if (getEmbedding) {
            context.params.query.$limit = 1;
            context.params.query.embedding = { $ne: pgvector.toSql(nullArray) };
          }
          return context;
        },
      ],
      // Optimize the create operation
      create: [
        // feathers hook to get the 'embedding' field from the request and make sure it is a valid pgvector (cast all to floats)
        async (context: HookContext) => {
<<<<<<< HEAD
          if (SKIP_DB_EXTENSIONS) return context
=======
          const { embedding } = context.data
>>>>>>> 949a5ad78375a220d1787b8a7bf33dabe62c44e8
          const { data, service } = context
          const docdb = app.get('docdb');
          const id = uuidv4()
          //Add UUID for events.
          context.data = {
            [service.id]: id,
            ...data,
          }
          let result = docdb.fromString(context.data.content, context.data)
          return result;
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
  });
};

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    documents: DocumentService;
  }
}
