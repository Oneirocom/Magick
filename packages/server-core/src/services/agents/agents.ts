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
  agentQueryResolver,
  agentJsonFields
} from './agents.schema'

import type { Application, HookContext } from '../../declarations'
import { AgentService, getOptions } from './agents.class'
import { handleJSONFieldsUpdate, jsonResolver } from '../utils'
import { randomUUID } from 'crypto'

export * from './agents.class'
export * from './agents.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const agent = (app: Application) => {
  // Register our service on the Feathers application
  app.use('agents', new AgentService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: ['find', 'get', 'create', 'patch', 'remove'],
    // You can add additional custom events to be sent to clients here
    events: [],
  })
  // Initialize hooks
  app.service('agents').hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(agentExternalResolver),
        schemaHooks.resolveResult(agentResolver),
        schemaHooks.resolveResult(jsonResolver(agentJsonFields)),
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(agentQueryValidator),
        schemaHooks.resolveQuery(agentQueryResolver),
        // ensure that "dirty" is always a boolean, if it is a 0 or 1 it will be converted to a boolean
        async (context: HookContext) => {
          console.log('CONTEXT params', context.params)
          if(!context.params.query) return context
          if (context.params.query.dirty === '0') {
            context.params.query.dirty = false
          } else if (context.params.query.dirty === '1') {
            context.params.query.dirty = true
          }
          return context
        },
        // do the same for patch requests
        async (context: HookContext) => {
          if(!context.data) return context
          console.log('context.data', context.data)
          if (context.data.dirty === '0') {
            context.data.dirty = false
          } else if (context.data.dirty === '1') {
            context.data.dirty = true
          }
          return context
        }
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(agentDataValidator),
        schemaHooks.resolveData(agentDataResolver),
        async (context: HookContext) => {
          context.data.id = randomUUID()
          return context
        }
      ],
      patch: [
        schemaHooks.validateData(agentPatchValidator),
        schemaHooks.resolveData(agentPatchResolver),
        handleJSONFieldsUpdate(agentJsonFields)
      ],
      update: [handleJSONFieldsUpdate(agentJsonFields)],
      remove: []
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
    agents: AgentService
  }
}
