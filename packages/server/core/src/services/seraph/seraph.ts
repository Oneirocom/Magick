import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  seraphEventDataValidator,
  seraphEventQueryValidator,
  seraphEventResolver,
  seraphEventExternalResolver,
  seraphEventDataResolver,
  seraphEventQueryResolver,
  seraphEventJsonFields,
} from './seraph.schema'
import type { Application, HookContext } from '../../declarations'
import { SeraphService, getOptions } from './seraph.class'
import { jsonResolver } from '../utils'
import { v4 as uuidv4 } from 'uuid'
import { checkPermissions } from '../../lib/feathersPermissions'

// Re-export spellReleases.class and spells.schema
export * from './seraph.class'
export * from './seraph.schema'

const SERAPH_EVENTS = [
  'request',
  'response',
  'error',
  'info',
  'functionStart',
  'functionEnd',
]

/**
 * Configure the seraph events service by registering it, its hooks, and its options.
 * @param app - The Feathers application
 */
export const seraphEvent = (app: Application) => {
  // Register the seraph events service on the Feathers application
  app.use('seraphEvents', new SeraphService(getOptions(app), app), {
    methods: ['create', 'find', 'get'],
    events: SERAPH_EVENTS,
  })

  // Initialize hooks for the seraph events service
  app.service('seraphEvents').hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(seraphEventExternalResolver),
        schemaHooks.resolveResult(seraphEventResolver),
        schemaHooks.resolveResult(jsonResolver(seraphEventJsonFields)),
      ],
    },
    before: {
      all: [
        checkPermissions({
          roles: ['owner'],
        }),
        schemaHooks.validateQuery(seraphEventQueryValidator),
        schemaHooks.resolveQuery(seraphEventQueryResolver),
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(seraphEventDataValidator),
        schemaHooks.resolveData(seraphEventDataResolver),
        async (context: HookContext) => {
          context.data.id = uuidv4()
          return context
        },
      ],
    },
    after: {
      all: [],
    },
    error: {
      all: [],
    },
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    seraphEvents: SeraphService
  }
}
