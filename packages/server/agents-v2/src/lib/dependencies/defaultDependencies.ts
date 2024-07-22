import { EventStore } from '../dependencies/eventStore'
import { RedisClientWrapper } from '../dependencies/redisService'
import { KeyvStateService } from '../dependencies/keyvStateService'
import { RedisPubSub } from '../dependencies/redisPubSub'
import { KeywordsLLMService as LLMService } from '../services/LLMService/KeywordsLLMService'
import { TypedEmitter } from 'tiny-typed-emitter'
import { DefaultDependenciesType } from '../interfaces/IDependencies'
import { CredentialManager } from '../services/credentialsManager/credentialsManager'

// Default implementations for the services
export const DEFAULT_DEPENDENCIES: DefaultDependenciesType = {
  redis: RedisClientWrapper,
  // pluginManager: PluginManagerService,
  stateService: KeyvStateService,
  pubSub: RedisPubSub,
  eventEmitter: TypedEmitter,
  // database: DatabaseService,
  eventStore: EventStore,
  LLMService: LLMService,
  credentialManager: CredentialManager,
}
