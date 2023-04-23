// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  datasetsDataValidator,
  datasetsPatchValidator,
  datasetsQueryValidator,
  datasetsResolver,
  datasetsExternalResolver,
  datasetsDataResolver,
  datasetsPatchResolver,
  datasetsQueryResolver,
} from './datasets.schema'

import type { Application } from '../../declarations'
import { DatasetsService, getOptions } from './datasets.class'

export const datasetsPath = 'datasets'
export const datasetsMethods = [
  'find',
  'get',
  'create',
  'patch',
  'remove',
] as const

export * from './datasets.class'
export * from './datasets.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const datasets = (app: Application) => {
  // Register our service on the Feathers application
  app.use(datasetsPath, new DatasetsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: datasetsMethods,
    // You can add additional custom events to be sent to clients here
    events: [],
  })
  // Initialize hooks
  app.service(datasetsPath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(datasetsExternalResolver),
        schemaHooks.resolveResult(datasetsResolver),
      ],
    },
    before: {
      all: [
        schemaHooks.validateQuery(datasetsQueryValidator),
        schemaHooks.resolveQuery(datasetsQueryResolver),
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(datasetsDataValidator),
        schemaHooks.resolveData(datasetsDataResolver),
      ],
      patch: [
        schemaHooks.validateData(datasetsPatchValidator),
        schemaHooks.resolveData(datasetsPatchResolver),
      ],
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

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [datasetsPath]: DatasetsService
  }
}
