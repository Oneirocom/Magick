// GENERATED 
import { hooks as schemaHooks } from '@feathersjs/schema';
import { SKIP_DB_EXTENSIONS } from '@magickml/engine';
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
          if (SKIP_DB_EXTENSIONS) return context;
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
        schemaHooks.validateData(documentDataValidator),
        schemaHooks.resolveData(documentDataResolver),
        (context: HookContext) => {
          if (SKIP_DB_EXTENSIONS) return context;

          const { embedding } = context.data;
          const { data, service } = context;
          const id = uuidv4();
          context.data = {
            [service.id]: id,
            ...data,
          };
          // Cast to pgvector if the embedding is a valid non-null array
          if (embedding && embedding.length > 0 && embedding[0] !== 0) {
            context.data.embedding = pgvector.toSql(embedding);
            const vectordb = app.get('vectordb');
            vectordb.add(id, embedding);
          } else {
            context.data.embedding = pgvector.toSql(nullArray);
          }
          return context;
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
        //   if (SKIP_DB_EXTENSIONS) return context;
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
