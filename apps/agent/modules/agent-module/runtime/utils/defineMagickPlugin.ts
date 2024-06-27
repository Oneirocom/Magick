import { BasePlugin } from '@magickml/agent-plugin'

export function defineAgentPlugin(name: string, constructor: BasePlugin) {
  return {
    name,
    constructor,
  }
}
