// DOCUMENTED
/**
 * This file contains code related to SolidityService, a Feathers service for compiling Solidity contracts.
 *
 * For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
 */

import { hooks as schemaHooks } from '@feathersjs/schema'
import type { Application } from 'server/core'
import { SolidityService, getOptions } from './solidity.class'

import {
  solidityQueryValidator,
  solidityResolver,
  solidityExternalResolver,
  solidityQueryResolver,
} from './solidity.schema'

/**
 * The path for accessing the Solidity service.
 */
export const solidityPath = 'solidity'

/**
 * The methods exposed by the Solidity service.
 */
export const solidityMethods = ['create'] as const

/**
 * This function registers the Solidity service and its hooks via `app.configure`.
 *
 * @param app - The Feathers application.
 */
export const solidity = (app: Application): void => {
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

export * from './solidity.class'
export * from './solidity.schema'
