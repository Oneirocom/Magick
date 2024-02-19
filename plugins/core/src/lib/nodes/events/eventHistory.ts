import { NodeCategory, makeFlowNodeDefinition } from '@magickml/behave-graph'
import { EventTypes } from 'communication'
import { IEventStore } from 'server/grimoire'

export const queryEventHistory = makeFlowNodeDefinition({
  typeName: 'queries/events/eventHistory',
  otherTypeNames: ['events/eventHistory'],
  category: NodeCategory.Flow,
  label: 'Event History',
  configuration: {
    hiddenProperties: {
      valueType: 'array',
      defaultValue: ['hiddenProperties', 'eventState', 'availableEvents'],
    },
    eventState: {
      valueType: 'array',
      defaultValue: ['sender', 'agentId'] as string[],
    },
    eventStateProperties: {
      valueType: 'array',
      defaultValue: ['client', 'connector', 'channel', 'from user', 'to user'],
    },
    availableEvents: {
      valueType: 'array',
      defaultValue: Object.values(EventTypes),
    },
    selectedEvents: {
      valueType: 'array',
      defaultValue: [],
    },
  },
  in: {
    flow: 'flow',
    entries: {
      valueType: 'integer',
      defaultValue: 10,
    },
  },
  out: {
    flow: 'flow',
    events: 'array',
    strings: 'array',
  },
  initialState: undefined,
  triggered: async ({ configuration, graph, read, write, commit }) => {
    const { eventState, selectedEvents } = configuration

    const eventStore = graph.getDependency<IEventStore>('IEventStore')

    if (!eventStore) {
      throw new Error('Event store not found')
    }

    const limit = Number(read('entries')) as number

    const events = await eventStore.queryEvents(
      eventState,
      selectedEvents,
      limit
    )

    const eventStrings = events.map(event => {
      return `${event.sender}: ${event.content}`
    })

    write('events', events)
    write('strings', eventStrings)
    commit('flow')
  },
})
