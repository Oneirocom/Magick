// DOCUMENTED
/**
 * This file provides a configure function exporting a request that registers the service and its hooks via `app.configure`.
 * @see https://dove.feathersjs.com/guides/cli/service.html
 */
import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  requestDataValidator,
  requestPatchValidator,
  requestQueryValidator,
  requestResolver,
  requestExternalResolver,
  requestDataResolver,
  requestPatchResolver,
  requestQueryResolver,
} from './requests.schema'

import type { Application } from '../../declarations'
import { AnalyticsParams, RequestService, getOptions } from './requests.class'
import { checkPermissions } from '../../lib/feathersPermissions'

// Exporting all functions and classes to be used by other modules
export * from './requests.class'
export * from './requests.schema'

/**
 * Registers the request service, sets up configuration and initializes hooks.
 * @param {Application} app - The initialized Feather app instance.
 */
export const request = (app: Application): void => {
  // Register our service on the Feathers application
  app.use('request', new RequestService(getOptions(app), app), {
    // A list of all methods this service exposes externally
    methods: ['find', 'get', 'create', 'patch', 'remove'],
    // You can add additional custom events to be sent to clients here
    events: [],
  })

  app.use('request/analytics', {
    find: getAgentAnalytics(),
  })

  // Initialize hooks
  app.service('request').hooks({
    around: {
      all: [
        // Push `requestExternalResolver` and `requestResolver` hooks that resolves external resource and returns a response respectively
        schemaHooks.resolveExternal(requestExternalResolver),
        schemaHooks.resolveResult(requestResolver),
      ],
    },
    before: {
      all: [
        checkPermissions({
          roles: ['owner', 'requests'],
        }),
        // Push `requestQueryValidator` and `requestQueryResolver` hooks that validate and resolve QueryParams respectively
        schemaHooks.validateQuery(requestQueryValidator),
        schemaHooks.resolveQuery(requestQueryResolver),
      ],
      find: [],
      get: [],
      create: [
        // Push `requestDataValidator` and `requestDataResolver` hooks that validate and resolve incoming data respectively
        schemaHooks.validateData(requestDataValidator),
        schemaHooks.resolveData(requestDataResolver),
      ],
      patch: [
        // Push `requestPatchValidator` and `requestPatchResolver` hooks that validate and resolve incoming data respectively
        schemaHooks.validateData(requestPatchValidator),
        schemaHooks.resolveData(requestPatchResolver),
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

export const getAgentAnalytics = () => {
  return async (param: AnalyticsParams) => await RequestService.analytics(param)
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    request: RequestService
  }
  interface ServiceTypes {
    'request/analytics': {
      find: ReturnType<typeof getAgentAnalytics>
    }
  }
}
