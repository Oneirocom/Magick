// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import type { Application } from '../../declarations'
import { ProjectsService } from './projects.class'
export * from './projects.class'

// A configure function that registers the service and its hooks via `app.configure`
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
      all: [],
      find: [],
      create: [
      ],
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
    'projects': ProjectsService
  }
}
