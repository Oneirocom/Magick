// DOCUMENTED
/**
 * Initializes the GoogleSearchService and its hooks via `app.configured`.
 * Registers the GoogleSearchService on the Feathers application.
 * @param app - The application in which the service is to be registered.
 * @returns void
 */

import type { Application } from 'server/core'
import { GoogleSearchService } from './google-search.class'

// Add this service to the service type index
declare module 'server/core' {
  interface ServiceTypes {
    'google-search': GoogleSearchService
  }
}

export * from './google-search.class'

export const googleSearch = (app: Application): void => {
  app.use('google-search', new GoogleSearchService(), {
    methods: ['find'], // Exposes the 'find' method of the GoogleSearchService externally.
    events: [], // Can add custom events to be sent to clients.
  })

  app.service('google-search').hooks({
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
