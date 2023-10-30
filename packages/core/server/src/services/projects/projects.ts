// DOCUMENTED
// For more information about this file, see https://dove.feathersjs.com/guides/cli/service.html
const checkPermissions = require('feathers-permissions')
import type { Application } from '../../declarations'
import { ProjectsService } from './projects.class'
export * from './projects.class'

/**
 * Configure function that registers the service and its hooks.
 * Exports projects function for other modules to import.
 * @param app {Application} - Feathers application
 */
export const projects = (app: Application) => {
  // Register our service on the Feathers application
  app.use('projects', new ProjectsService(), {
    // A list of all methods this service exposes externally
    methods: ['find', 'create'],
    // You can add additional custom events to be sent to clients here
    events: [],
  })

  // Initialize hooks
  app.service('projects').hooks({
    around: {
      all: [],
    },
    before: {
      all: [
        checkPermissions({
          roles: ['admin', 'projects'],
        }),
      ],
      find: [],
      create: [],
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
  /**
   * Interface for ServiceTypes
   */
  interface ServiceTypes {
    projects: ProjectsService
  }
}
