// DOCUMENTED
import { hooks as schemaHooks } from '@feathersjs/schema';
import {
  solidityQueryValidator,
  solidityResolver,
  solidityExternalResolver,
  solidityQueryResolver,
} from './solidity.schema';
import type { Application } from '@magickml/server-core';
import { SolidityService, getOptions } from './solidity.class';

// Extend ServiceTypes interface to include SolidityService
declare module '@magickml/server-core' {
  interface ServiceTypes {
    [solidityPath]: SolidityService;
  }
}

// Export path, methods and other required elements
export const solidityPath = 'solidity';
export const solidityMethods = ['create'] as const;
export * from './solidity.class';
export * from './solidity.schema';

/**
 * Plugin for adding SolidityService to an application.
 * @param {Application} app - Application running the Service.
 */
export const solidity = (app: Application): void => {
  // Initialize SolidityService in app
  app.use(
    solidityPath,
    new SolidityService(getOptions(app)),
    { methods: solidityMethods, events: [] }
  );

  // Set hooks for SolidityService
  app.service(solidityPath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(solidityExternalResolver),
        schemaHooks.resolveResult(solidityResolver),
      ],
    },
    before: {
      all: [
        schemaHooks.validateQuery(solidityQueryValidator),
        schemaHooks.resolveQuery(solidityQueryResolver),
      ],
      create: [],
    },
    after: {
      all: [],
    },
    error: {
      all: [],
    },
  });
};
