import type { Application, HookContext } from '../../declarations'
import { CollectionService, getOptions } from './collections.class'
import { v4 as uuidv4 } from 'uuid'

/**
 * Configure the collection service by registering it, its hooks, and its options.
 * @param app - The Feathers application
 */
export const collection = (app: Application) => {
  // Register the collection service on the Feathers application
  app.use('collections', new CollectionService(getOptions(app), app))

  // Initialize hooks for the collection service
  const service = app.service('collections')

  service.hooks({
    before: {
      all: [],
      find: [],
      get: [],
      create: [
        async (context: HookContext) => {
          context.data.id = uuidv4()
          return context
        },
      ],
      patch: [],
      update: [],
      remove: [],
    },
    after: {
      all: [],
    },
    error: {
      all: [],
    },
  })
}

// Add the collection service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    collections: CollectionService
  }
}
