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
import { SeraphFunction } from 'servicesShared'
// Re-export spellReleases.class and spells.schema
export * from './seraph.class'
export * from './seraph.schema'

const SERAPH_EVENTs = [
  'error',
  'message',
  'info',
  'token',
  'request',
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
    events: SERAPH_EVENTs,
  })

  const seraph = app.get('seraphCore')

  seraph.on('token', (token: string) => {
    app.emit('token', token)
  })

  seraph.on('message', (message: string) => {
    app.emit('message', message)
  })

  seraph.on('error', (error: string) => {
    app.emit('error', error)
  })

  seraph.on('info', (info: string) => {
    app.emit('info', info)
  })

  seraph.on('functionExecution', (seraphFunction: SeraphFunction) => {
    app.emit('functionExecution', seraphFunction)
  })

  seraph.on('functionResult', (seraphFunction: SeraphFunction) => {
    app.emit('functionResult', seraphFunction)
  })

  seraph.on('middlewareExecution', (middlewareFunction: SeraphFunction) => {
    app.emit('middlewareExecution', middlewareFunction)
  })

  seraph.on('middlewareResult', (middlewareFunction: SeraphFunction) => {
    app.emit('middlewareResult', middlewareFunction)
  })

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
