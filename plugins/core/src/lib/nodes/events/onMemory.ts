import { Assert, NodeCategory } from '@magickml/behave-graph'
import { makeMagickEventNodeDefinition } from 'server/grimoire'
import { CORE_DEP_KEYS } from '../../config'
import { Memory, MemoryStreamService } from '../../services/memoryStreamService'

type State = {
  onMemoryEvent?: ((memmory: Memory) => void) | undefined
}

const makeInitialState = (): State => ({
  onMemoryEvent: undefined,
})

export const onMemory = makeMagickEventNodeDefinition(
  {
    typeName: 'events/memory/onMemory',
    label: 'On Memory Added',
    category: NodeCategory.Event,
    in: {},
    out: {
      flow: 'flow',
      memory: 'object',
    },
    initialState: makeInitialState(),
  },
  {
    init: ({ state, commit, write, graph, finish, handleState }) => {
      Assert.mustBeTrue(state.onMemoryEvent === undefined)

      const memoryStreamService = graph.getDependency<MemoryStreamService>(
        CORE_DEP_KEYS.MEMORY_STREAM_SERVICE
      )

      if (!memoryStreamService) {
        throw new Error('MemoryStreamService dependency not found')
      }

      const onMemoryEvent = (memory: Memory) => {
        const event = memory.event

        handleState(event, false)

        write('memory', memory)
        commit('flow', () => {
          finish()
        })
      }

      memoryStreamService.on('memoryAdded', onMemoryEvent)

      return {
        onMemoryEvent,
      }
    },
    dispose: ({ graph, state }) => {
      const memoryStreamService = graph.getDependency<MemoryStreamService>(
        CORE_DEP_KEYS.MEMORY_SERVICE
      )

      if (!memoryStreamService || !state.onMemoryEvent) return {}

      memoryStreamService.removeListener('memoryAdded', state.onMemoryEvent)

      return {
        onMemoryEvent: undefined,
      }
    },
  }
)
