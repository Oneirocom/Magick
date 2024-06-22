import { makeFlowNodeDefinition, NodeCategory } from '@magickml/behave-graph'
import { type PluginCredentialsManager } from 'server/plugin'
import { CORE_DEP_KEYS } from 'servicesShared'

export const getSecretNode = makeFlowNodeDefinition({
  typeName: 'agent/getSecret',
  category: NodeCategory.Action,
  label: 'Get Agent Secret',
  in: {
    flow: 'flow',
    name: 'string',
  },
  out: {
    flow: 'flow',
    value: 'string',
  },
  initialState: undefined,
  triggered: async ({ commit, write, read, graph }) => {
    const { getDependency } = graph
    const name = read('name') as string
    console.log('getSecretNode: name', name)
    if (!name) {
      throw new Error(`getSecretNode: name is required`)
    }

    const getSecret = getDependency<
      PluginCredentialsManager['getCustomCredential']
    >(CORE_DEP_KEYS.GET_SECRET)

    if (!getSecret) {
      throw new Error(`getSecret dependency not found`)
    }

    const value = await getSecret(name)
    console.log('getSecretNode: value', value)
    if (!value) {
      throw new Error(`getSecretNode: secret not found for ${name}`)
    }

    write('value', value)

    commit('flow')
  },
})
