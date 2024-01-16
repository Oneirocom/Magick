import { hooks as schemaHooks } from '@feathersjs/schema'
import { Application } from '../../declarations'
import { GraphEventService, getOptions } from './graphEvents.class'
import {
  graphEventsDataResolver,
  graphEventsDataValidator,
  graphEventsExternalResolver,
  graphEventsPatchResolver,
  graphEventsPatchValidator,
  graphEventsQueryResolver,
  graphEventsQueryValidator,
  graphEventsResolver,
} from './graphEvents.schema'
import { checkPermissions } from '../../lib/feathersPermissions'

export * from './graphEvents.class'
export * from './graphEvents.schema'

export const graphEvents = (app: Application) => {
  app.use('graphEvents', new GraphEventService(getOptions(app), app), {
    methods: ['find', 'get', 'create', 'patch', 'remove'],
  })

  app.service('graphEvents').hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(graphEventsExternalResolver),
        schemaHooks.resolveResult(graphEventsResolver),
      ],
    },
    before: {
      all: [
        checkPermissions({
          roles: ['owner', 'graphEvents'],
        }),
      ],
      find: [
        schemaHooks.validateQuery(graphEventsQueryValidator),
        schemaHooks.resolveQuery(graphEventsQueryResolver),
      ],
      get: [
        schemaHooks.validateQuery(graphEventsQueryValidator),
        schemaHooks.resolveQuery(graphEventsQueryResolver),
      ],
      create: [
        schemaHooks.validateData(graphEventsDataValidator),
        schemaHooks.resolveQuery(graphEventsDataResolver),
      ],
      patch: [
        schemaHooks.validateData(graphEventsPatchValidator),
        schemaHooks.resolveQuery(graphEventsPatchResolver),
      ],
      remove: [
        schemaHooks.validateQuery(graphEventsQueryValidator),
        schemaHooks.resolveQuery(graphEventsQueryResolver),
      ],
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

declare module '../../declarations' {
  interface ServiceTypes {
    graphEvents: GraphEventService
  }
}
