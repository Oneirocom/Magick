import { getLogger } from '@magickml/server-logger'
import type { Application } from '../../declarations'
import { CredentialsService } from './credentials.class'
import { Params } from '@feathersjs/feathers'
import { RedisPubSub } from '@magickml/redis-pubsub'
import { REDIS_URL } from '@magickml/server-config'

export * from './credentials.class'

/**
 * Registers the credentials service, sets up configuration, and initializes hooks.
 * @param {Application} app - The initialized Feather app instance.
 */
export const credentials = (app: Application): void => {
  const logger = getLogger()
  const pubsub = new RedisPubSub(REDIS_URL || '')
  pubsub.initialize()

  app.use('credentials', new CredentialsService(app), {
    methods: ['create', 'remove', 'find'],
    events: [],
  })

  app.service('credentials').hooks({
    before: {},
    after: {},
    error: {},
  })
  app.use('credentials/link', {
    find: async (params: Params) => {
      if (!params.query) {
        throw new Error('Query parameters are missing')
      }

      const credentialsService = app.service(
        'credentials'
      ) as CredentialsService
      try {
        await credentialsService.linkCredentialToAgent({
          agentId: params.query.agentId,
          credentialId: params.query.credentialId,
        })
        return { success: true }
      } catch (error) {
        logger.error('error:', error)
        return { success: false }
      }
    },
  })

  app.use('credentials/agent', {
    find: async (params: Params) => {
      if (!params.query) {
        throw new Error('Query parameters are missing')
      }

      const credentialsService = app.service(
        'credentials'
      ) as CredentialsService

      return await credentialsService.listAgentCredentials({
        agentId: params.query.agentId,
        serviceType: params.query.serviceType,
      })
    },
    remove: async (id: string, params: Params) => {
      if (!params.query) {
        throw new Error('Query parameters are missing')
      }

      const credentialsService = app.service(
        'credentials'
      ) as CredentialsService
      try {
        await credentialsService.removeAgentCredential({
          agentId: params.query.agentId,
          credentialId: params.query.credentialId,
        })
        return { success: true }
      } catch (error) {
        logger.error('error:', error)
        return { success: false }
      }
    },
  })

  app.use('credentials/v2', {
    find: async (params: Params) => {
      if (!params.query) {
        throw new Error('Query parameters are missing')
      }

      const credentialsService = app.service(
        'credentials'
      ) as CredentialsService
      try {
        return await credentialsService.getCredentials(params.query.agentId)
      } catch (error) {
        logger.error('error:', error)
        return { success: false }
      }
    },
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    credentials: CredentialsService
    'credentials/link': {
      find: ReturnType<any>
    }
    'credentials/agent': {
      find: ReturnType<any>
      remove: ReturnType<any>
    }
    'credentials/v2': {
      find: ReturnType<any>
    }
  }
}
