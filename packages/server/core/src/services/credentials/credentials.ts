import type { Application, HookContext } from '../../declarations'
import { CredentialsService, getOptions } from './credentials.class'

export * from './credentials.class'

/**
 * Registers the credentials service, sets up configuration and initializes hooks.
 * @param {Application} app - The initialized Feather app instance.
 */
export const credentials = (app: Application): void => {
  app.use('credentials', new CredentialsService(app), {
    methods: ['create', 'remove'],
    events: [],
  })

  app.service('credentials').hooks({
    before: {
      create: [
        async (context: HookContext) => {
          context.data = {
            ...context.data,
            projectId: context.params.query.projectId,
          }
          return context
        },
      ],
    },
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    credentials: CredentialsService
  }
}
