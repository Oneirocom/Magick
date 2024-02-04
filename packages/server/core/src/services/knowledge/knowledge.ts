// KNOWLEDGEED
import { hooks as schemaHooks } from '@feathersjs/schema'
import { Application } from '../../declarations'
import { KnowledgeService, getOptions } from './knowledge.class'
import {
  knowledgeExternalResolver,
  knowledgePatchResolver,
  knowledgePatchValidator,
  knowledgeQueryResolver,
  knowledgeQueryValidator,
  knowledgeResolver,
} from './knowledge.schema'
import { checkPermissions } from '../../lib/feathersPermissions'

export * from './knowledge.class'
export * from './knowledge.schema'

/**
 * A configure function that registers the service and its hooks via `app.configure`.
 * @param app - The Feathers application.
 */
export const knowledge = (app: Application) => {
  // Register our service on the Feathers application
  app.use('knowledge', new KnowledgeService(getOptions(app)), {
    methods: ['find', 'get', 'create', 'patch', 'remove'],
    events: [],
  })

  // Initialize hooks
  app.service('knowledge').hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(knowledgeExternalResolver),
        schemaHooks.resolveResult(knowledgeResolver),
      ],
    },
    before: {
      all: [
        checkPermissions({
          roles: ['owner', 'knowledge'],
        }),
        schemaHooks.validateQuery(knowledgeQueryValidator),
        schemaHooks.resolveQuery(knowledgeQueryResolver),
      ],
      find: [],
      get: [],
      create: [],
      patch: [
        schemaHooks.validateData(knowledgePatchValidator),
        schemaHooks.resolveData(knowledgePatchResolver),
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
    knowledge: KnowledgeService
  }
}
