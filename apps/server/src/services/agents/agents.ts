// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  agentDataValidator,
  agentPatchValidator,
  agentQueryValidator,
  agentResolver,
  agentExternalResolver,
  agentDataResolver,
  agentPatchResolver,
  agentQueryResolver
} from './agents.schema'

import type { Application } from '../../declarations'
import { AgentService, getOptions } from './agents.class'

export * from './agents.class'
export * from './agents.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const agent = (app: Application) => {
  // Register our service on the Feathers application
  app.use('agents', new AgentService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: ['find', 'get', 'create', 'patch', 'remove'],
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service('agents').hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(agentExternalResolver),
        schemaHooks.resolveResult(agentResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(agentQueryValidator), schemaHooks.resolveQuery(agentQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(agentDataValidator), schemaHooks.resolveData(agentDataResolver)],
      patch: [schemaHooks.validateData(agentPatchValidator), schemaHooks.resolveData(agentPatchResolver),],
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
    agents: AgentService
  }
}
