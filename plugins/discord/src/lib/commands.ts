import { type PluginCommandInfo } from 'server/plugin'
import { basePluginCommands } from 'server/plugin'

export const discordPluginCommands: Record<string, PluginCommandInfo> = {
  ...basePluginCommands,
}
