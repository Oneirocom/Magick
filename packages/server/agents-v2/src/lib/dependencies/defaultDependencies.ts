import { EventStore } from '../dependencies/eventStore'
import { RedisClientWrapper } from '../dependencies/redisService'
import { KeyvStateService } from '../dependencies/keyvStateService'
import { RedisPubSub } from '../dependencies/redisPubSub'
import { KeywordsLLMService as LLMService } from '../services/LLMService/KeywordsLLMService'
import { TypedEmitter } from 'tiny-typed-emitter'
import { DefaultDependenciesType } from '../interfaces/IDependencies'
import { CredentialManager } from '../services/credentialsManager/credentialsManager'
import { SpellManager } from './spellManager'
import { EventRouter } from './eventRouter'
import { SpellbookLibrary } from './spellbookLibrary'
import { ChannelManager } from './channelManager'
import { MockChannelService } from '../mocks/ChannelService'

// Default implementations for the services
export const DEFAULT_DEPENDENCIES: DefaultDependenciesType = {
  redis: RedisClientWrapper,
  // pluginManager: PluginManagerService,
  stateService: KeyvStateService,
  pubSub: RedisPubSub,
  eventEmitter: TypedEmitter,
  eventRouter: EventRouter,
  spellManager: SpellManager,
  spellbookLibrary: SpellbookLibrary,
  channelManager: ChannelManager,
  // TODO Replace this mock with the real service
  channelService: MockChannelService,
  // database: DatabaseService,
  eventStore: EventStore,
  LLMService: LLMService,
  credentialManager: CredentialManager,
}
