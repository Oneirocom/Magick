// DOCUMENTED
/**
 * This file configures the spellReleases service with its hooks and utility functions.
 * For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
 */

// Import necessary modules and functions
import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  spellReleaseDataValidator,
  spellReleaseQueryValidator,
  spellReleaseResolver,
  spellReleaseExternalResolver,
  spellReleaseDataResolver,
  spellReleaseQueryResolver,
  spellReleaseJsonFields,
} from './spellReleases.schema'
import type { Application, HookContext } from '../../declarations'
import { SpellReleasesService, getOptions } from './spellReleases.class'
import { jsonResolver } from '../utils'
import { v4 as uuidv4 } from 'uuid'
import { checkPermissions } from '../../lib/feathersPermissions'

// Re-export spellReleases.class and spells.schema
export * from './spellReleases.class'
export * from './spellReleases.schema'

const SPELL_EVENTS = ['log', 'result', 'spell', 'run', 'command']

/**
 * Configure the spellReleases service by registering it, its hooks, and its options.
 * @param app - The Feathers application
 */
export const spellReleases = (app: Application) => {
  // Register the spellReleases service on the Feathers application
  app.use('spellReleases', new SpellReleasesService(getOptions(app), app), {
    methods: ['find', 'get', 'create', 'remove'],
    events: SPELL_EVENTS,
  })

  // Initialize hooks for the spellReleases service
  app.service('spellReleases').hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(spellReleaseExternalResolver),
        schemaHooks.resolveResult(spellReleaseResolver),
        schemaHooks.resolveResult(jsonResolver(spellReleaseJsonFields)),
      ],
    },
    before: {
      all: [
        checkPermissions({
          roles: ['owner'],
        }),
        schemaHooks.validateQuery(spellReleaseQueryValidator),
        schemaHooks.resolveQuery(spellReleaseQueryResolver),
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(spellReleaseDataValidator),
        schemaHooks.resolveData(spellReleaseDataResolver),
        async (context: HookContext) => {
          context.data.id = uuidv4()
          return context
        },
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

// add the spellRelease service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    spellReleases: SpellReleasesService
    '/spellReleases/createRelease': {
      create: ReturnType<any>
    }
  }
}
