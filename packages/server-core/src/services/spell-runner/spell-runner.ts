// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import type { Application } from '../../declarations'
import { checkForSpellInManager } from '../../hooks/spellmanagerHooks'
import { SpellRunnerService } from './spell-runner.class'

export * from './spell-runner.class'

// A configure function that registers the service and its hooks via `app.configure`
export const spellRunner = (app: Application) => {
  // Register our service on the Feathers application
  app.use('spell-runner', new SpellRunnerService(), {
    // A list of all methods this service exposes externally
    methods: ['get', 'create','update'],
    // You can add additional custom events to be sent to clients here
    events: []
  })

  // Initialize hooks
  app.service('spell-runner').hooks({
    around: {
      all: [

      ]
    },
    before: {
      all: [

      ],
      get: [

      ],
      create: [
        // checkForSpellInManager
      ],
      update: [

      ]
    },
    after: {
      all: [],

    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'spell-runner': SpellRunnerService
  }
}
