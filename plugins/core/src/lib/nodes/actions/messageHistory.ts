import { NodeCategory, makeFlowNodeDefinition } from '@magickml/behave-graph'
import { IEventStore } from 'server/grimoire'

export const getMessageHistory = makeFlowNodeDefinition({
  typeName: 'queries/messages/getMessageHistory',
  otherTypeNames: ['events/getMessageHistory'],
  category: NodeCategory.Flow,
  label: 'Message History',
  configuration: {
    hiddenProperties: {
      valueType: 'array',
      defaultValue: ['hiddenProperties', 'eventState'],
    },
    eventState: {
      valueType: 'array',
      defaultValue: ['channel', 'connector'] as string[],
    },
  },
  in: {
    flow: 'flow',
    alterateRoles: {
      valueType: 'boolean',
      defaultValue: false,
    },
    entries: {
      valueType: 'integer',
      defaultValue: 10,
    },
  },
  out: {
    flow: 'flow',
    messages: 'array',
  },
  initialState: undefined,
  triggered: async ({ configuration, graph, read, write, commit }) => {
    const { eventState } = configuration

    const eventStore = graph.getDependency<IEventStore>('IEventStore')

    if (!eventStore) {
      throw new Error('Event store not found')
    }

    const limit = Number(read('entries')) as number
    const alterateRoles = Boolean(read('alterateRoles')) as boolean

    const messages =
      (
        await eventStore.getMessages(eventState, limit, alterateRoles)
      ).reverse() || []

    if (messages.length > 0 && messages[0].role === 'assistant') {
      messages.shift()
    }

    write('messages', messages)
    commit('flow')
  },
})
