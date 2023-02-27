// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import type { Application } from '@magickml/server-core'
import { RestApiService, getOptions } from './rest-api.class'

export * from './rest-api.class'

// A configure function that registers the service and its hooks via `app.configure`
export const restApi = (app: Application) => {
  // Register our service on the Feathers application
  app.use('rest-api', new RestApiService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: ['find', 'get', 'create', 'patch', 'remove'],
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service('rest-api').hooks({
    around: {
      all: []
    },
    before: {
      all: [],
      find: [],
      get: [],
      create: [],
      patch: [],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '@magickml/server-core' {
  interface ServiceTypes {
    'rest-api': RestApiService
  }
}
