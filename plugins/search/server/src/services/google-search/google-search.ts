// DOCUMENTED 
/**
 * Initializes the GoogleSearchService and its hooks via `app.configured`.
 * Registers the GoogleSearchService on the Feathers application.
 * @param app - The application in which the service is to be registered.
 * @returns void
 */

import type { Application } from '@magickml/server-core';
import { GoogleSearchService } from './google-search.class';

export * from './google-search.class';

export const googleSearch = (app: Application): void => {
  app.use('google-search', new GoogleSearchService(), {
    methods: ['find'], // Exposes the 'find' method of the GoogleSearchService externally.
    events: [], // Can add custom events to be sent to clients.
  });

  app.service('google-search').hooks({
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
  });
};
