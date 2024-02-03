import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  userResolver,
  userExternalResolver,
  userQueryValidator,
} from './users.schema'
import type { Application } from '../../declarations'

import { checkPermissions } from '../../lib/feathersPermissions'
import { UserService } from './users.class'
import { UserParams } from './users.class'

const USER_EVENTS = ['log', 'error', 'update', 'create', 'budgetUpdated']

export const users = (app: Application) => {
  app.use('user', new UserService(app), {
    methods: ['get'],
    events: USER_EVENTS,
  })

  app.service('user').hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(userExternalResolver),
        schemaHooks.resolveResult(userResolver),
      ],
    },
    before: {
      all: [
        checkPermissions({
          roles: ['owner', 'user'],
        }),
        schemaHooks.validateQuery(userQueryValidator),
      ],
      get: [],
      // find: [],
      // create: [],
      // patch: [],
      // update: [],
      // remove: [],
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
    user: UserService<UserParams> // Use the UserParams type in the UserService declaration
  }
}
