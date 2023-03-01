// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { hooks as schemaHooks } from '@feathersjs/schema'
import { randomUUID } from 'crypto'
import {
  spellDataValidator,
  spellPatchValidator,
  spellQueryValidator,
  spellResolver,
  spellExternalResolver,
  spellDataResolver,
  spellPatchResolver,
  spellQueryResolver,
} from './spells.schema'

import type { Application } from '../../declarations'
import { SpellService, getOptions } from './spells.class'

export * from './spells.class'
export * from './spells.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const spell = (app: Application) => {
  // Register our service on the Feathers application
  app.use('spells', new SpellService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: ['find', 'get', 'create', 'patch', 'remove', 'saveDiff'],
    // You can add additional custom events to be sent to clients here
    events: [],
  })

  // Initialize hooks
  app.service('spells').hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(spellExternalResolver),
        schemaHooks.resolveResult(spellResolver),
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
        async (context: any) => {
          const { data, service } = context
          context.data = {
            [service.id]: randomUUID(),
            ...data,
          }
          await context.service.find({
            query: {
                name: data.name
            }
          }).then(async (param) => {
              if (param.data.length >= 1) {
                console.log(data.name+'(%)')
                await context.service.find({
                  query: {
                    name: {
                      $ilike: data.name+' (%)'
                    }
                  }
                }).then((val) => {                 
                  context.data.name = data.name + " (" + (1+val.data.length) +")"
                })
          }

          });
        },
      ],
      patch: [
        schemaHooks.validateData(spellPatchValidator),
        schemaHooks.resolveData(spellPatchResolver),
      ],
      remove: [],
    },
    after: {
      all: [],
      create: [],
      patch: [
        // after saving a spell, we need to update the spell cache
        async (context: any) => {
          const { app } = context
          const { id } = context.result
          const spell = await app.service('spells').get(id)
          app.userSpellManagers.forEach(userSpellManager => {
            if (userSpellManager.spellRunnerMap.has(spell.name)) {
              userSpellManager.spellRunnerMap.get(spell.name).loadSpell(spell)
            }
          })
        },
      ],
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
