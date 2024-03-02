import { type PluginCommandInfo } from 'server/plugin'
import { basePluginCommands } from 'server/plugin'

export const corePluginCommands: Record<string, PluginCommandInfo> = {
  ...basePluginCommands,
}
