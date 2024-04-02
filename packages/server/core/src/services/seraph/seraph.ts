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

// Update these to match seraph emitter
const SERAPH_EVENTS = [
  'error',
  'message',
  'info',
  'token',
  'request',
  'response',
  'functionExecution',
  'functionResult',
  'middlewareExecution',
  'middlewareResult',
]

/**
 * Configure the seraph events service by registering it, its hooks, and its options.
 * @param app - The Feathers application
 */
export const seraph = (app: Application) => {
  // Register the seraph events service on the Feathers application
  app.use('seraph', new SeraphService(getOptions(app), app), {
    methods: ['create', 'find', 'get'],
    events: SERAPH_EVENTS,
  })

  // const seraph = app.get('seraph')

  // seraph.on('token', (token: string) => {
  //   app.services('seraph').emit('token', token)
  // })

  // Initialize hooks for the seraph events service
  app.service('seraph').hooks({
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
    seraph: SeraphService
  }
}
