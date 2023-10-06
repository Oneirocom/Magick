import type { Application, HookContext } from '../../declarations'
import { RecordService, getOptions } from './records.class'
import { v4 as uuidv4 } from 'uuid'

/**
 * Configure the record service by registering it, its hooks, and its options.
 * @param app - The Feathers application
 */
export const records = (app: Application) => {
  // Register the record service on the Feathers application
  app.use('records', new RecordService(getOptions(app), app))

  // Initialize hooks for the record service
  const service = app.service('records')

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

// Add the record service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    records: RecordService
  }
}
