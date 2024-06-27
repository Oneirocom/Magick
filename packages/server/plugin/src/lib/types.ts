import { PluginCredential } from '@magickml/credentials'
import { PluginCommandInfo } from './commands/command-manager'

/**
 * Defines the structure for BasePlugin event names.
 */
export type BasePluginEvents = ReadonlyArray<string>

/**
 * Defines the structure for BasePlugin actions.
 */
export interface BasePluginActions {
  [key: string]: string
}

export type BasePluginActionKey = keyof BasePluginActions

/**
 * Defines the structure for BasePlugin dependency keys.
 * These are the keys that the plugin will use to access dependencies.
 */
export interface BasePluginDepKeys {
  [key: string]: string
}

export interface BasePluginCommands {
  [key: string]: PluginCommandInfo
}

/**
 * Defines the structure for BasePlugin State.
 * Does not extend PluginStateType but has same structure.
 */

export type BasePluginState<T extends object = Record<string, unknown>> = T & {
  enabled: boolean
  context: Record<string, unknown>
}

export type BasePluginCredentials = ReadonlyArray<Readonly<PluginCredential>>

/**
 * Configuration object for BasePlugin plugins.
 */
export interface BasePluginConfig<
  Events extends Record<string, string>,
  Actions extends Record<string, string>,
  Dependencies extends Record<string, string>,
  Commands extends Record<string, string>
> {
  events: Events
  actions: Actions
  dependencyKeys: Dependencies
  commands: Commands
  developerMode: boolean
  credentials: ReadonlyArray<Readonly<PluginCredential>>
}
