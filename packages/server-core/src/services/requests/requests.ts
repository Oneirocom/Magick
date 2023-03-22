// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  requestDataValidator,
  requestPatchValidator,
  requestQueryValidator,
  requestResolver,
  requestExternalResolver,
  requestDataResolver,
  requestPatchResolver,
  requestQueryResolver
} from './requests.schema'

import type { Application } from '../../declarations'
import { RequestService, getOptions } from './requests.class'

export * from './requests.class'
export * from './requests.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const request = (app: Application) => {
  // Register our service on the Feathers application
  app.use('request', new RequestService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: ['find', 'get', 'create', 'patch', 'remove'],
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service('request').hooks({
    around: {
      all: [schemaHooks.resolveExternal(requestExternalResolver), schemaHooks.resolveResult(requestResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(requestQueryValidator), schemaHooks.resolveQuery(requestQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(requestDataValidator), schemaHooks.resolveData(requestDataResolver)],
      patch: [schemaHooks.validateData(requestPatchValidator), schemaHooks.resolveData(requestPatchResolver)],
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
declare module '../../declarations' {
  interface ServiceTypes {
    request: RequestService
  }
}
