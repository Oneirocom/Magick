// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  userDataValidator,
  userPatchValidator,
  userQueryValidator,
  userResolver,
  userExternalResolver,
  userDataResolver,
  userPatchResolver,
  userQueryResolver,
} from './users.schema'

import type { Application } from '../../declarations'
import { UserService, getOptions } from './users.class'

export * from './users.class'
export * from './users.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const user = (app: Application) => {
  // Register our service on the Feathers application
  app.use('users', new UserService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: ['find', 'get', 'create', 'patch', 'remove'],
    // You can add additional custom events to be sent to clients here
    events: [],
  })

  const authFunction = 
    process.env.USE_AUTH !== 'true' && process.env.NODE_ENV === 'development' ? authenticate : () => (context: any, next: any) => next()
  
  // Initialize hooks
  app.service('users').hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(userExternalResolver),
        schemaHooks.resolveResult(userResolver),
      ],
      find: [authFunction('jwt')],
      get: [authFunction('jwt')],
      create: [],
      update: [authenticate('jwt')],
      patch: [authFunction('jwt')],
      remove: [authFunction('jwt')],
    },
    before: {
      all: [
        schemaHooks.validateQuery(userQueryValidator),
        schemaHooks.resolveQuery(userQueryResolver),
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(userDataValidator),
        schemaHooks.resolveData(userDataResolver),
      ],
      patch: [
        schemaHooks.validateData(userPatchValidator),
        schemaHooks.resolveData(userPatchResolver),
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

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    users: UserService
  }
}
