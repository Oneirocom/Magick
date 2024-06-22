import { NodeCategory, makeFlowNodeDefinition } from '@magickml/behave-graph'
import { CoreActionService } from '../../services/coreActionService'
import { IEventStore } from 'server/grimoire'
import { CORE_DEP_KEYS } from 'servicesShared'

export const sendMessage = makeFlowNodeDefinition({
  typeName: 'magick/sendMessage',
  category: NodeCategory.Action,
  label: 'Send Message',
  in: {
    flow: 'flow',
    content: 'string',
    skipSave: {
      valueType: 'boolean',
      defaultValue: false,
    },
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

    const skipSave = Boolean(read('skipSave'))
    const content = read('content')
    const _event = eventStore.currentEvent()

    if (!_event) {
      throw new Error('No event found')
    }

    const event = { ..._event }

    if (skipSave) {
      event.skipSave = true
    }

    coreActionService?.sendMessage(event, { content })

    commit('flow')
  },
})
