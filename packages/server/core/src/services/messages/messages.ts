// DOCUMENTED
import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  messageExternalResolver,
  messagePatchResolver,
  messagePatchValidator,
  messageDataResolver,
  messageDataValidator,
  messageQueryResolver,
  messageQueryValidator,
  messageResolver,
} from './messages.schema'

import { Application } from '../../declarations'
import { ChatMessageService, getOptions } from './messages.class'
import { checkPermissions } from '../../lib/feathersPermissions'

/**
 * Export the Event class and message schema
 */
export * from './messages.class'
export * from './messages.schema'

/**
 * A configure function that registers the service and its hooks via `app.configure`
 * @param app {Application}
 */
export const chatMessages = (app: Application) => {
  // Register our service on the Feathers application
  app.use('chatMessages', new ChatMessageService(getOptions(app)), {
    methods: ['find', 'get', 'create', 'patch', 'remove'],
  })

  // Initialize hooks

  app.service('chatMessages').hooks({
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
      ],
      find: [
        schemaHooks.validateQuery(messageQueryValidator),
        schemaHooks.resolveQuery(messageQueryResolver),
      ],
      get: [
        schemaHooks.validateQuery(messageQueryValidator),
        schemaHooks.resolveQuery(messageQueryResolver),
      ],
      create: [
        schemaHooks.validateData(messageDataValidator),
        schemaHooks.resolveQuery(messageDataResolver),
      ],
      patch: [
        schemaHooks.validateData(messagePatchValidator),
        schemaHooks.resolveData(messagePatchResolver),
      ],
      remove: [
        schemaHooks.validateQuery(messageQueryValidator),
        schemaHooks.resolveQuery(messageQueryResolver),
      ],
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
    chatMessages: ChatMessageService
  }
}
