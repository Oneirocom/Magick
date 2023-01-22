// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import type { Application } from '../../declarations'
import { SpellRunnerService, getOptions } from './spell-runner.class'

export * from './spell-runner.class'

// A configure function that registers the service and its hooks via `app.configure`
export const spellRunner = (app: Application) => {
  // Register our service on the Feathers application
  app.use('spell-runner', new SpellRunnerService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: ['find', 'get', 'create', 'patch', 'remove'],
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service('spell-runner').hooks({
    around: {
      all: [
       // authenticate('jwt')
      ]
    },
    before: {
      all: [],
      find: [],
      get: [],
      create: [],
      patch: [],
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
    'spell-runner': SpellRunnerService
  }
}
