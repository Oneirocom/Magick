import { makeFlowNodeDefinition, NodeCategory } from '@magickml/behave-graph'
import { type BasePlugin } from '@magickml/agent-plugin'
import { CORE_DEP_KEYS } from '@magickml/shared-services'

// plan is to not hardcode this and generate it dynamically by what plugins are enabled
export enum PluginStateChoice {
  CORE = 'core',
  DISCORD = 'discord',
  SLACK = 'slack',
}

export const getStateNode = makeFlowNodeDefinition({
  typeName: 'agent/getState',
  category: NodeCategory.Action,
  label: 'Get Agent State',
  in: {
    flow: 'flow',
    plugin: {
      label: 'Data Type',
      choices: Object.values(PluginStateChoice),
      defaultValue: PluginStateChoice.CORE,
      valueType: 'string',
    },
  },
  out: {
    flow: 'flow',
    state: 'object',
  },
  initialState: undefined,
  triggered: async ({ commit, write, read, graph }) => {
    const { getDependency } = graph
    const plugin = read('plugin') as PluginStateChoice

    if (!Object.values(PluginStateChoice).includes(plugin)) {
      throw new Error(`Invalid plugin in getStateNode: ${plugin}`)
    }

    const getState = getDependency<
      BasePlugin['stateManager']['getGlobalState']
    >(CORE_DEP_KEYS.GET_STATE)

    if (!getState) {
      throw new Error(`getState dependency not found`)
    }

    const state = await getState(plugin)
    write('state', state)

    commit('flow')
  },
})
