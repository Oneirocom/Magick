// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  solidityDataValidator,
  solidityQueryValidator,
  solidityResolver,
  solidityExternalResolver,
  solidityDataResolver,
  solidityQueryResolver,
} from './solidity.schema'

import type { Application } from '@magickml/server-core'
import { SolidityService, getOptions } from './solidity.class'

// Add this service to the service type index
declare module '@magickml/server-core' {
  interface ServiceTypes {
    [solidityPath]: SolidityService
  }
}

export const solidityPath = 'solidity'
export const solidityMethods = ['create'] as const

export * from './solidity.class'
export * from './solidity.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const solidity = (app: Application) => {
  // Register our service on the Feathers application
  app.use(solidityPath, new SolidityService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: solidityMethods,
    // You can add additional custom events to be sent to clients here
    events: [],
  })
  // Initialize hooks
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
  })
}
