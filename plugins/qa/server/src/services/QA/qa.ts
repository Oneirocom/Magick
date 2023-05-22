// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import type { Application } from '@magickml/server-core'
import { QAService, getOptions } from './qa.class'

// Add this service to the service type index
declare module '@magickml/server-core' {
  interface ServiceTypes {
    [QAPath]: QAService
  }
}

export const QAPath = 'qa'
export const QAMethods = ['find'] as const

export * from './qa.class'
export * from './qa.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const qa = (app: Application) => {
  // Register our service on the Feathers application
  app.use(QAPath, new QAService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: QAMethods,
    // You can add additional custom events to be sent to clients here
    events: [],
  })
  // Initialize hooks
  app.service(QAPath).hooks({
    around: {
      all: [],
    },
    before: {
      all: [],
    },
    
    after: {
      all: [],
    },
    error: {
      all: [],
    },
  })
}
