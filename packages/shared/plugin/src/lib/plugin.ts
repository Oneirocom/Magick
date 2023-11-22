import { Agent } from 'server/agents'
import { CompletionProvider } from 'shared/core'

export type PluginSecret = {
  name: string
  key: string
  global?: boolean
  getUrl?: string
}

export type Command = {
  name: string
  description: string
  command: string
  icon: string
}

export type ExtendableAgent = Agent & {
  [key: string]: any
}

export type PluginClientCommandList = Record<string, Command>

export type PluginServerCommandList = Record<
  string,
  (data: any, agent: ExtendableAgent) => void
>

export type PluginIOType = {
  name: string
  inspectorControls?: any[]
  sockets?: any[]
  defaultResponseOutput?: string
  handler?: ({ output, agent, event }) => Promise<void>
}

type PluginConstuctor = {
  name: string
  secrets?: PluginSecret[]
  completionProviders?: CompletionProvider[]
  agentCommands?: PluginServerCommandList
}
export class Plugin {
  name: string
  secrets: PluginSecret[]
  completionProviders: CompletionProvider[]
  constructor({
    name,
    secrets = [],
    completionProviders = [],
  }: PluginConstuctor) {
    this.name = name
    this.secrets = secrets
    this.completionProviders = completionProviders
  }
}
