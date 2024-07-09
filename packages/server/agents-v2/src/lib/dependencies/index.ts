import { IStateService } from '@magickml/behave-graph'
import { PluginManagerService } from '../dependencies/pluginManagerService'
// import { IDatabaseService } from './database';
import { Agent, AgentConfigOptions } from '../Agent'
import { EventStore } from '../dependencies/eventStore'
import { RedisClientWrapper } from '../dependencies/redisService'
import { KeyvStateService } from '../dependencies/keyvStateService'
import { RedisPubSub } from '../dependencies/redisPubSub'
import { TypedEmitter } from 'tiny-typed-emitter'
import { IRedis } from '../interfaces/IRedis'
import { IDatabaseService } from '../interfaces/IDatabase'
import { IEventStore } from '../interfaces/IEventStore'
import { ISpellbook } from '../interfaces/ISpellbook'
import { IPubSub } from '../interfaces/IPubSub'
import { IEventEmitter } from '../interfaces/IEventEmitter'
import { ISpellStorage } from '../interfaces/ISpellStorage'
import { ICommandHub } from '../interfaces/ICommandHub'
import {
  DefaultDependenciesType,
  ServiceType,
} from '../interfaces/IDependencies'

/**
 * This is the central source of truth for all dependencies that are available.
 * Register all dependencies HERE.
 */
export const DependencyInterfaces = {
  GraphStateService: {} as IStateService,
  Redis: {} as IRedis,
  PluginManager: {} as PluginManagerService,
  Database: {} as IDatabaseService,
  EventStore: {} as IEventStore,
  Spellbook: {} as ISpellbook,
  Agent: {} as Agent,
  Options: {} as AgentConfigOptions,
  PubSub: {} as IPubSub,
  EventEmitter: {} as IEventEmitter,
  SpellStorage: {} as ISpellStorage,
  CommandHub: {} as ICommandHub,
  // We can also just use this to add key:value types for later access
  ['Factory<EventStore>']: {} as unknown,
  // ... other services
} as const

/**
 * Mapping of configuration keys to service types. If you want to make a service configurable
 * via the config options, add it here.
 */
export const CONFIG_TO_SERVICE_MAP = {
  stateService: { useSingleton: true, service: 'GraphStateService' },
  redis: { useSingleton: true, service: 'Redis' },
  pubSub: { useSingleton: true, service: 'PubSub' },
  pluginManager: { useSingleton: true, service: 'PluginManager' },
  // database: { useSingleton: true, service: 'Database' },
  eventStore: { useSingleton: false, service: 'EventStore' },
  eventEmitter: { useSingleton: true, service: 'EventEmitter' },
  // ... other mappings
} as const

// Default implementations for the services
export const DEFAULT_DEPENDENCIES: DefaultDependenciesType = {
  redis: RedisClientWrapper,
  pluginManager: PluginManagerService,
  stateService: KeyvStateService,
  pubSub: RedisPubSub,
  eventEmitter: TypedEmitter,
  // database: DatabaseService,
  eventStore: EventStore,
}

/**
 * This types object is used across the agent to retrieve the dependencies.
 */
export const TYPES: Record<ServiceType, ServiceType> = Object.keys(
  DependencyInterfaces
).reduce((acc, key) => {
  acc[key as ServiceType] = key as ServiceType
  return acc
}, {} as Record<ServiceType, ServiceType>)
