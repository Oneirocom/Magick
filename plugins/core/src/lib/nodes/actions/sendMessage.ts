import { NodeCategory, makeFlowNodeDefinition } from '@magickml/behave-graph'
import { CoreActionService } from '../../services/coreActionService'
import { IEventStore } from 'server/grimoire'

export const sendMessage = makeFlowNodeDefinition({
  typeName: 'magick/sendMessage',
  category: NodeCategory.Action,
  label: 'Send Message',
  in: {
    flow: 'flow',
    content: 'string',
  },
  out: {
    flow: 'flow',
  },
  initialState: undefined,
  triggered: async ({ commit, read, graph: { getDependency } }) => {
    const coreActionService =
      getDependency<CoreActionService>('coreActionService')
    const eventStore = getDependency<IEventStore>('IEventStore')

    if (!coreActionService || !eventStore) {
      throw new Error('No coreActionService or eventStore provided')
    }

    const content = read('content')
    const event = eventStore.currentEvent()

    if (!event) {
      throw new Error('No event found')
    }

    coreActionService?.sendMessage(event, { content })

    commit('flow')
  },
})
