import { IStateService } from '@magickml/behave-graph'
import { PluginManagerService } from '../services/pluginManagerService'
// import { IDatabaseService } from './database';
import { GraphStateService } from '../services/stateService'
import { IDatabaseService } from './database'
import { DatabaseService } from '../services/databaseService/databaseService'
import { IEventStore } from './eventStore'
import { ISpellbook } from './spellbook'
import { Agent, AgentConfigOptions } from '../Agent'
import { EventStore } from '../services/eventStore'
import { IRedis } from './IRedis'
import { RedisClientWrapper } from '../services/redisService'

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
  ['Factory<EventStore>']: {} as unknown,
  Spellbook: {} as ISpellbook,
  Agent: {} as Agent,
  Options: {} as AgentConfigOptions,
  // ... other services
} as const

/**
 * This types object is used across the agent to retrieve the dependencies.
 */
export const TYPES: Record<ServiceType, ServiceType> = Object.keys(
  DependencyInterfaces
).reduce((acc, key) => {
  acc[key as ServiceType] = key as ServiceType
  return acc
}, {} as Record<ServiceType, ServiceType>)

/**
 * Mapping of configuration keys to service types. If you want to make a service configurable
 * via the config options, add it here.
 */
export const CONFIG_TO_SERVICE_MAP = {
  stateService: { useSingleton: true, service: 'GraphStateService' },
  redis: { useSingleton: true, service: 'Redis' },
  pluginManager: { useSingleton: true, service: 'PluginManager' },
  database: { useSingleton: true, service: 'Database' },
  eventStore: { useSingleton: false, service: 'EventStore' },
  // ... other mappings
} as const

/**
 * Verify that all services are mapped. This will throw a compile-time error if a service is not mapped.
 */
export type _verifyMapping = VerifyServiceMapping<typeof CONFIG_TO_SERVICE_MAP>

interface Constructor<T> {
  new (...args: any[]): T
}

type DefaultDependenciesType = {
  [K in keyof typeof CONFIG_TO_SERVICE_MAP]: Constructor<
    (typeof DependencyInterfaces)[(typeof CONFIG_TO_SERVICE_MAP)[K]['service']]
  >
}

// Default implementations for the services
export const DEFAULT_DEPENDENCIES: DefaultDependenciesType = {
  redis: RedisClientWrapper,
  pluginManager: PluginManagerService,
  stateService: GraphStateService,
  database: DatabaseService,
  eventStore: EventStore,
}

/**
 * Maps the internal service type to the service
 */
export type CoreServiceMap = {
  [K in ServiceType]: new () => ServiceInterface<K>
}
/**
 * Used for mapping configuration keys to service types
 */
export type InternalServiceType = keyof typeof DependencyInterfaces

/**
 * Mapping of configuration keys to service types
 */
type ConfigToServiceMapType = {
  [key: string]: { useSingleton: boolean; service: InternalServiceType }
}

/**
 * Ensure that all services are mapped properly
 */
type EnsureAllServicesAreMapped<T extends ConfigToServiceMapType> = T & {
  [K in InternalServiceType]: {
    [P in keyof T]: T[P]['service'] extends K ? P : never
  }[keyof T]
}

/**
 * Verify that all services are mapped
 */
type VerifyServiceMapping<T extends ConfigToServiceMapType> = [
  keyof T
] extends [{ [K in InternalServiceType]: any }[InternalServiceType]]
  ? EnsureAllServicesAreMapped<T>
  : never

/**
 * Type of the configuration service
 **/
export type ConfigServiceType = keyof typeof CONFIG_TO_SERVICE_MAP
export type ConfigToServiceMapping = typeof CONFIG_TO_SERVICE_MAP
export type ConfigToDependencyMap = {
  [K in ConfigServiceType]: (typeof DependencyInterfaces)[ConfigToServiceMapping[K]['service']]
}

/**
 * Mapping of configuration keys to service types
 */
export type ServiceType = keyof typeof DependencyInterfaces

/**
 * Mapping of configuration keys to service types
 */
export type ServiceMap = {
  [K in ServiceType]: ServiceInterface<K>
}

export type ServiceInterface<K extends ServiceType> =
  (typeof DependencyInterfaces)[K]
