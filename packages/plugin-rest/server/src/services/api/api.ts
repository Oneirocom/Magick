// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  apiDataValidator,
  apiPatchValidator,
  apiQueryValidator,
  apiResolver,
  apiExternalResolver,
  apiDataResolver,
  apiPatchResolver,
  apiQueryResolver
} from './api.schema'

import type { Application } from '@magickml/server-core'
import { ApiService, getOptions } from './api.class'


// Add this service to the service type index
declare module '@magickml/server-core' {
  interface ServiceTypes {
    [apiPath]: ApiService
  }
}

export const apiPath = 'api'
export const apiMethods = ['get', 'create', 'patch', 'update', 'remove'] as const

export * from './api.class'
export * from './api.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const api = (app: Application) => {
  // Register our service on the Feathers application
  app.use(apiPath, new ApiService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: apiMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(apiPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(apiExternalResolver), schemaHooks.resolveResult(apiResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(apiQueryValidator), schemaHooks.resolveQuery(apiQueryResolver)],
      find: [],
      get: [],
      update: [schemaHooks.validateData(apiDataValidator), schemaHooks.resolveData(apiDataResolver)],
      create: [schemaHooks.validateData(apiDataValidator), schemaHooks.resolveData(apiDataResolver)],
      patch: [schemaHooks.validateData(apiPatchValidator), schemaHooks.resolveData(apiPatchResolver)],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  } as any) // TODO: fix me
}