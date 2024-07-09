import { PluginManagerService } from '../dependencies/pluginManagerService'
import { EventStore } from '../dependencies/eventStore'
import { RedisClientWrapper } from '../dependencies/redisService'
import { KeyvStateService } from '../dependencies/keyvStateService'
import { RedisPubSub } from '../dependencies/redisPubSub'
import { TypedEmitter } from 'tiny-typed-emitter'
import { CONFIG_TO_SERVICE_MAP, DependencyInterfaces } from '../dependencies'

/**
 * Verify that all services are mapped. This will throw a compile-time error if a service is not mapped.
 */
export type _verifyMapping = VerifyServiceMapping<typeof CONFIG_TO_SERVICE_MAP>

export interface Constructor<T> {
  new (...args: any[]): T
}

export type DefaultDependenciesType = {
  [K in keyof typeof CONFIG_TO_SERVICE_MAP]: Constructor<
    (typeof DependencyInterfaces)[(typeof CONFIG_TO_SERVICE_MAP)[K]['service']]
  >
}

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
export type ConfigToServiceMapType = {
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
