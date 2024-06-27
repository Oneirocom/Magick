import { NodeCategory, makeFlowNodeDefinition } from '@magickml/behave-graph'
import { CoreActionService } from '../../services/coreActionService'
import { IEventStore } from '@magickml/grimoire'
import { CORE_DEP_KEYS } from '@magickml/shared-services'

export const addMessage = makeFlowNodeDefinition({
  typeName: 'magick/addMessage',
  category: NodeCategory.Action,
  label: 'Add message',
  in: {
    flow: 'flow',
    content: 'string',
    role: {
      valueType: 'string',
      choices: ['user', 'assistant'],
      defaultValue: 'user',
      label: 'Role',
    },
  },
  out: {
    flow: 'flow',
  },
  initialState: undefined,
  triggered: async ({ commit, read, graph: { getDependency } }) => {
    const coreActionService = getDependency<CoreActionService>(
      CORE_DEP_KEYS.ACTION_SERVICE
    )
    const eventStore = getDependency<IEventStore>(CORE_DEP_KEYS.EVENT_STORE)

    if (!coreActionService || !eventStore) {
      throw new Error('No coreActionService or eventStore provided')
    }

    const content = read('content') as string
    const role = read('role') as 'user' | 'assistant'
    await eventStore.addMessage(content, role)

    commit('flow')
  },
})
