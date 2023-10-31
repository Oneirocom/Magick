// DOCUMENTED
/**
 * This module provides a configure function that registers the spell-runner service and its hooks on a Feathers application instance.
 * @packageDocumentation
 */
import checkPermissions from 'feathers-permissions'
import type { Application } from '../../declarations'
import { checkForSpellInManager } from '../../hooks/spellmanagerHooks'
import { SpellRunnerService } from './spell-runner.class'

/**
 * Exports all members of the `SpellRunnerService` module.
 */
export * from './spell-runner.class'

/**
 * Configures a Feathers application instance by registering the `spell-runner` service and its hooks on it.
 * @param app The Feathers application instance.
 */
export const spellRunner = (app: Application): void => {
  // Register the `spell-runner` service
  app.use('spell-runner', new SpellRunnerService(), {
    // A list of all methods this service exposes externally
    methods: ['get', 'create', 'update'],
    // You can add additional custom events to be sent to clients here
    events: [],
  })

  // Initialize hooks for the `spell-runner` service
  app.service('spell-runner').hooks({
    around: {
      all: [],
    },
    before: {
      all: [
        checkPermissions({
          roles: ['owner', 'spell-runner'],
        }) as any,
      ],
      get: [],
      create: [checkForSpellInManager], // Only check for the spell in the manager before creating it.
      update: [],
    },
    after: {
      all: [],
    },
    error: {
      all: [],
    },
  })
}

/**
 * Augments the `ServiceTypes` interface of the Feathers application so that it includes the `spell-runner` service.
 */
declare module '../../declarations' {
  interface ServiceTypes {
    'spell-runner': SpellRunnerService
  }
}
