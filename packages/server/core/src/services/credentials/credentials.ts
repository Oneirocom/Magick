import type { Application, HookContext } from '../../declarations'
import { CredentialsService } from './credentials.class'

export * from './credentials.class'

/**
 * Registers the credentials service, sets up configuration and initializes hooks.
 * @param {Application} app - The initialized Feather app instance.
 */
export const credentials = (app: Application): void => {
  app.use('credentials', new CredentialsService(app), {
    methods: [
      'create',
      'remove',
      'find',
      'linkCredentialToAgent',
      'listAgentCredentials',
      'removeAgentCredential',
    ],
    events: [],
  })

  app.service('credentials').hooks({
    before: {},
    after: {},
    error: {},
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    credentials: CredentialsService
  }
}
