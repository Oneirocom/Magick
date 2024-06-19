import { BasePlugin } from 'server/plugin'

export function defineAgentPlugin(name: string, constructor: BasePlugin) {
  return {
    name,
    constructor,
  }
}
