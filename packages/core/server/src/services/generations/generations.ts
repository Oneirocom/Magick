import type { Application, HookContext } from '../../declarations'
import { GenerationService, getOptions } from './generations.class'
import { v4 as uuidv4 } from 'uuid'

/**
 * Configure the generation service by registering it, its hooks, and its options.
 * @param app - The Feathers application
 */
export const generations = (app: Application) => {
  // Register the generation service on the Feathers application
  app.use('generations', new GenerationService(getOptions(app), app))

  // Initialize hooks for the generation service
  const service = app.service('generations')

  service.hooks({
    before: {
      all: [],
      find: [],
      get: [],
      create: [
        async (context: HookContext) => {
          context.data.id = uuidv4()
          return context
        },
      ],
      patch: [],
      update: [],
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

// Add the generation service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    generations: GenerationService
  }
}
