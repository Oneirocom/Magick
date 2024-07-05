import { IStateService } from '@magickml/behave-graph'
import { Service } from '../core/service'
import { Redis } from 'ioredis'
import { PluginManagerService } from '../services/pluginManagerService'
// import { IDatabaseService } from './database'
import { RedisService } from '../services/redisService'
import { GraphStateService } from '../services/stateService'
import { IDatabaseService } from './database'
import { DatabaseService } from '../services/databaseService/databaseService'
import { IEventStore } from './eventStore'
import { EventStoreService } from '../services/eventStore/eventStoreService'
import { ISpellbook } from './spellbook'

/**
 * This is the central source of truth for all services that are available.
 * Register all services HERE.
 */
export const ServiceInterfaces = {
  GraphStateService: {} as IStateService,
  RedisService: {} as Redis,
  PluginManagerService: {} as PluginManagerService,
  DatabaseService: {} as IDatabaseService,
  EventStore: {} as IEventStore,
  Spellbook: {} as ISpellbook,
  // ... other services
} as const

/**
 * Mapping of configuration keys to service types.  This is done so we can change
 * the naming of the service for external confuration.
 */
export const CONFIG_TO_SERVICE_MAP = {
  stateService: 'GraphStateService',
  redis: 'RedisService',
  pluginManager: 'PluginManagerService',
  database: 'DatabaseService',
  eventStore: 'EventStore',
  // ... other mappings
} as const

/**
 * Verify that all services are mapped.  This will throw a compile time error if a service is not mapped.
 */
export type _verifyMapping = VerifyServiceMapping<typeof CONFIG_TO_SERVICE_MAP>

/**
 * Default services that will be used if no service is provided.
 * Be sure to register here all default service fallbacks when adding services to the agent.
 */
export const DEFAULT_SERVICES: Record<
  ConfigServiceType,
  new () => Service<any>
> = {
  redis: RedisService,
  pluginManager: PluginManagerService,
  stateService: GraphStateService,
  database: DatabaseService,
  eventStore: EventStoreService,
}

/**
 * This types object is used across the agent to retreive the dependencies.
 */
export const TYPES: Record<ServiceType, ServiceType> = Object.keys(
  ServiceInterfaces
).reduce((acc, key) => {
  acc[key as ServiceType] = key as ServiceType
  return acc
}, {} as Record<ServiceType, ServiceType>)

/**
 * Maps the internal service type to the service
 */
export type CoreServiceMap = {
  [K in ServiceType]: new () => Service<ServiceInterface<K>>
}
/**
 * Used for mapping configuration keys to service types
 */
export type InternalServiceType = keyof typeof ServiceInterfaces

/**
 * Mapping of configuration keys to service types
 */
type ConfigToServiceMapType = {
  [key: string]: InternalServiceType
}

/**
 * Ensure that all services are mapped properly
 */
type EnsureAllServicesAreMapped<T extends ConfigToServiceMapType> = T & {
  [K in InternalServiceType]: {
    [P in keyof T]: T[P] extends K ? P : never
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

/**
 * Mapping of configuration keys to service types
 */
export type ServiceType = keyof typeof ServiceInterfaces

/**
 * Mapping of configuration keys to service types
 */
export type ServiceMap = {
  [K in ServiceType]: Service<ServiceInterface<K>>
}

export type ServiceInterface<K extends ServiceType> =
  (typeof ServiceInterfaces)[K]
