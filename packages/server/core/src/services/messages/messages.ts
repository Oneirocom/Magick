// DOCUMENTED
import { hooks as schemaHooks } from '@feathersjs/schema'
import pgvector from 'pgvector/pg'
import {
  messageExternalResolver,
  messagePatchResolver,
  messagePatchValidator,
  messageQueryResolver,
  messageQueryValidator,
  messageResolver,
} from './messages.schema'

import { Application, HookContext } from '../../declarations'
import { ChatMessageService, getOptions } from './messages.class'
import { checkPermissions } from '../../lib/feathersPermissions'

/**
 * Export the Event class and message schema
 */
export * from './messages.class'
export * from './messages.schema'

// Null array with 1536 values
const nullArray = new Array(1536).fill(0)

/**
 * A configure function that registers the service and its hooks via `app.configure`
 * @param app {Application}
 */
export const chatMessages = (app: Application) => {
  // Register our service on the Feathers application
  app.use('chatMessage', new ChatMessageService(getOptions(app)), {
    methods: ['find', 'get', 'create', 'patch', 'remove'],
  })

  // Initialize hooks

  app.service('chatMessage').hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(messageExternalResolver),
        schemaHooks.resolveResult(messageResolver),
      ],
    },
    before: {
      all: [
        checkPermissions({
          roles: ['owner', 'messages'],
        }),
        schemaHooks.validateQuery(messageQueryValidator),
        schemaHooks.resolveQuery(messageQueryResolver),
      ],
      find: [],
      get: [
        (context: HookContext) => {
          const { getEmbedding } = context.params.query
          if (getEmbedding) {
            context.params.query.$limit = 1
            context.params.query.embedding = { $ne: pgvector.toSql(nullArray) }
          }
          return context
        },
      ],
      create: [
     ],
      patch: [
        schemaHooks.validateData(messagePatchValidator),
        schemaHooks.resolveData(messagePatchResolver),
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
    chatMessage: ChatMessageService
  }
}
