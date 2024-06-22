import { EventPayload } from 'servicesShared'
import BasePlugin, { BasePluginInit } from './basePlugin'
import { NodeDefinition, ValueType } from '@magickml/behave-graph'

type CreatePluginArgs = BasePluginInit & {
  name: string
  nodes?: NodeDefinition[]
  values?: ValueType[]
  provideDependencies?: (
    plugin: BasePlugin,
    spellCaster: any
  ) => Record<string, any>
}

export const createSimplePluginClass = ({
  name,
  nodes = [],
  values = [],
  provideDependencies = () => ({}),
}: Omit<CreatePluginArgs, keyof Omit<BasePluginInit, 'name'>>) => {
  return class SimplePlugin extends BasePlugin {
    nodes: NodeDefinition[] = nodes
    values: ValueType[] = values
    credentials = []
    defaultState = { enabled: true }

    constructor({ agent, connection, projectId }: BasePluginInit) {
      super({ name, agent, connection, projectId })
    }

    getPluginConfig() {
      return {
        actions: {},
        events: {},
        dependencyKeys: {},
        commands: {},
        developerMode: false,
        credentials: [],
      }
    }

    async beforeActivate() {}
    async afterActivate() {}
    async beforeDeactivate() {}
    async afterDeactivate() {}
    beforeDestroy() {}
    afterDestroy() {}

    getCommandHandlers() {
      return {}
    }

    handleEnableCommand() {}
    handleDisableCommand() {}
    handleLinkCommand() {}
    handleUnlinkCommand() {}
    handleWebhookCommand() {}

    defineEvents() {}

    getActionHandlers() {
      return {}
    }

    getDependencies(spellCaster: any): Record<string, any> {
      return provideDependencies(this, spellCaster)
    }

    formatPayload(event: string, details: EventPayload) {
      return details
    }
  }
}
