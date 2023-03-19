// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import type { Application } from '@magickml/server-core'
import { GoogleSearchService } from './google-search.class'

export * from './google-search.class'

// A configure function that registers the service and its hooks via `app.configure`
export const googleSearch = (app: Application) => {
  // Register our service on the Feathers application
  app.use('google-search' as any, new GoogleSearchService(), {
    // A list of all methods this service exposes externally
    methods: ['find'],
    // You can add additional custom events to be sent to clients here
    events: [],
  })

  // Initialize hooks
  app.service('google-search' as any).hooks({
    around: {
      all: [],
    },
    before: {
      all: [],
      get: [],
      create: [],
      update: [],
    },
    after: {
      all: [],
    },
    error: {
      all: [],
    },
  })
}
