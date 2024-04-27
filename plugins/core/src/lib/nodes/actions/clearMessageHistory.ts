import { NodeCategory, makeFlowNodeDefinition } from '@magickml/behave-graph'
import { IEventStore } from 'server/grimoire'

export const clearMessageHistory = makeFlowNodeDefinition({
  typeName: 'queries/messages/clearMessageHistory',
  otherTypeNames: ['events/clearMessageHistory'],
  category: NodeCategory.Flow,
  label: 'Clear Message History',
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
  },
  out: {
    flow: 'flow',
  },
  initialState: undefined,
  triggered: async ({ configuration, graph, commit }) => {
    const { eventState } = configuration

    const eventStore = graph.getDependency<IEventStore>('IEventStore')

    if (!eventStore) {
      throw new Error('Event store not found')
    }

    await eventStore.deleteMessages(eventState)
    commit('flow')
  },
})
