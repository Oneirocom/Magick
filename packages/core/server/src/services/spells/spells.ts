// DOCUMENTED
/**
 * For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
 */

// Imports
import { hooks as schemaHooks } from '@feathersjs/schema'
import type { Application } from '../../declarations'
import {
  checkForSpellInManager,
  updateSpellInManager,
} from '../../hooks/spellmanagerHooks'
import { jsonResolver } from '../utils'
import { SpellService, getOptions } from './spells.class'
import {
  spellDataResolver,
  spellDataValidator,
  spellExternalResolver,
  spellJsonFields,
  spellPatchResolver,
  spellPatchValidator,
  spellQueryResolver,
  spellQueryValidator,
  spellResolver,
} from './spells.schema'

// Exports
export * from './spells.class'
export * from './spells.schema'

/**
 * A configure function that registers the service and its hooks via `app.configure`.
 *
 * @param app - Application
 */
export const spell = (app: Application) => {
  // Configure pagination
  app.set('paginate', {
    default: 1000,
    max: 1000,
  })

  // Register our service on the Feathers application
  app.use('spells', new SpellService(getOptions(app)), {
    methods: ['find', 'get', 'create', 'patch', 'remove', 'saveDiff'],
    events: [],
  })

  // Initialize hooks
  app.service('spells').hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(spellExternalResolver),
        schemaHooks.resolveResult(spellResolver),
        schemaHooks.resolveResult(jsonResolver(spellJsonFields)),
      ],
    },
    before: {
      all: [
        schemaHooks.validateQuery(spellQueryValidator),
        schemaHooks.resolveQuery(spellQueryResolver),
      ],
      find: [],
      get: [],
      create: [
        // if there's no spellId, generate a new uuidv4 id
        async (context: HookContext) => {
          const { data } = context
          if (!data.spellId) {
            context.data = {
              ...data,
              id: uuidv4(),
            }
          }
        },
        schemaHooks.validateData(spellDataValidator),
        schemaHooks.resolveData(spellDataResolver),
        // async (context: HookContext) => {
        //   const { data, service } = context
        //   context.data = {
        //     [service.id]: uuidv4(),
        //     ...data,
        //   }
        //   await context.service
        //     .find({
        //       query: {
        //         projectId: data.projectId,
        //         name: data.name,
        //       },
        //     })
        //     .then(async param => {
        //       if (param.data.length >= 1) {
        //         await context.service
        //           .find({
        //             query: {
        //               projectId: data.projectId,
        //               name: {
        //                 $ilike: data.name + ' (%)',
        //               },
        //             },
        //           })
        //           .then(val => {
        //             context.data.name = data.name + ' (' + (1 + val.data.length) + ')'
        //           })
        //       }
        //     })
        // },
      ],
      patch: [
        schemaHooks.validateData(spellPatchValidator),
        schemaHooks.resolveData(spellPatchResolver),
      ],
      update: [],
      remove: [],
    },
    after: {
      all: [],
      create: [],
      patch: [checkForSpellInManager, updateSpellInManager],
      saveDiff: [checkForSpellInManager, updateSpellInManager],
    },
    error: {
      all: [],
    },
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    spells: SpellService
  }
}
