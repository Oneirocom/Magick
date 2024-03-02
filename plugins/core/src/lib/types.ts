import { EventTypes } from 'communication'
import { EventPayload } from 'server/plugin'
import { corePluginCredentials } from './constants'
import { type ExtractCredentialNames } from 'server/credentials'
import { type PluginStateType } from 'plugin-state'

export interface CorePluginState extends PluginStateType {
  enabled: boolean
}

// is a Record<string, string> of the .name and plugins from the credential array
export type PluginCredentialsMap = ExtractCredentialNames<
  typeof corePluginCredentials
>

export type CorePluginEvents = {
  [EventTypes.ON_MESSAGE]: (payload: EventPayload) => void
}
