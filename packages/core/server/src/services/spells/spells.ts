// DOCUMENTED
/**
 * For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
 */

// Imports
import { hooks as schemaHooks } from '@feathersjs/schema'
import { v4 as uuidv4 } from 'uuid'
import type { Application, HookContext } from '../../declarations'
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
        schemaHooks.validateData(spellDataValidator),
        schemaHooks.resolveData(spellDataResolver),
        async (context: HookContext) => {
          const { data, service } = context
          context.data = {
            [service.id]: uuidv4(),
            ...data,
          }
          await context.service
            .find({
              query: {
                name: data.name,
              },
            })
            .then(async param => {
              if (param.data.length >= 1) {
                console.log(data.name + '(%)')

                await context.service
                  .find({
                    query: {
                      name: {
                        $ilike: data.name + ' (%)',
                      },
                    },
                  })
                  .then(val => {
                    context.data.name =
                      data.name + ' (' + (1 + val.data.length) + ')'
                  })
              }
            })
        },
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
