// DOCUMENTED
import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  taskExternalResolver,
  taskPatchResolver,
  taskPatchValidator,
  taskQueryResolver,
  taskQueryValidator,
  taskResolver,
} from './tasks.schema'

import { Application } from '../../declarations'
import { TaskService, getOptions } from './tasks.class'
import { checkPermissions } from '../../lib/feathersPermissions'

/**
 * Export the Task class and task schema
 */
export * from './tasks.class'
export * from './tasks.schema'

/**
 * A configure function that registers the service and its hooks via `app.configure`
 * @param app {Application}
 */
export const task = (app: Application) => {
  // Register our service on the Feathers application
  app.use('tasks', new TaskService(getOptions(app)), {
    methods: ['find', 'get', 'create', 'patch', 'remove'],
  })

  // Initialize hooks

  app.service('tasks').hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(taskExternalResolver),
        schemaHooks.resolveResult(taskResolver),
      ],
    },
    before: {
      all: [
        checkPermissions({
          roles: ['owner', 'tasks'],
        }),
        schemaHooks.validateQuery(taskQueryValidator),
        schemaHooks.resolveQuery(taskQueryResolver),
      ],
      find: [],
      get: [],
      create: [],
      patch: [
        schemaHooks.validateData(taskPatchValidator),
        schemaHooks.resolveData(taskPatchResolver),
      ],
      remove: [],
    },
    after: {
      create: [],
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
    tasks: TaskService
  }
}
