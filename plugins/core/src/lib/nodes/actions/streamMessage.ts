import { NodeCategory, makeFlowNodeDefinition } from '@magickml/behave-graph'
import { CoreActionService } from '../../services/coreActionService'
import { IEventStore } from 'server/grimoire'
import { CORE_DEP_KEYS } from '../../config'

export const streamMessage = makeFlowNodeDefinition({
  typeName: 'magick/streamMessage',
  category: NodeCategory.Action,
  label: 'Stream Message',
  in: {
    flow: 'flow',
    content: 'string',
  },
  out: {
    flow: 'flow',
  },
  initialState: undefined,
  triggered: ({ commit, read, graph: { getDependency } }) => {
    const coreActionService = getDependency<CoreActionService>(
      CORE_DEP_KEYS.ACTION_SERVICE
    )
    const eventStore = getDependency<IEventStore>(CORE_DEP_KEYS.EVENT_STORE)

    if (!coreActionService || !eventStore) {
      throw new Error('No coreActionService or eventStore provided')
    }

    const content = read('content')
    const event = eventStore.currentEvent()

    if (!event) {
      throw new Error('No event found')
    }

    coreActionService?.streamMessage(event, { content })

    commit('flow')
  },
})
