import {
  Assert,
  ILifecycleEventEmitter,
  NodeCategory,
} from '@magickml/behave-graph'
import { makeMagickEventNodeDefinition } from 'server/grimoire'
import { CORE_DEP_KEYS } from '../../config'
import { Agent } from 'server/agents'

type State = {
  onTickEvent?: (() => void) | undefined
}

const makeInitialState = (): State => ({
  onTickEvent: undefined,
})

export const LifecycleOnTick = makeMagickEventNodeDefinition(
  {
    typeName: 'lifecycles/onTick',
    label: 'On Tick',
    category: NodeCategory.Event,
    in: {},
    out: {
      flow: 'flow',
      deltaSeconds: 'float',
    },
    initialState: makeInitialState(),
  },
  {
    init: ({ state, commit, write, graph, handleState, finish }) => {
      Assert.mustBeTrue(state.onTickEvent === undefined)

      const lifecycleEventEmitter = graph.getDependency<ILifecycleEventEmitter>(
        'ILifecycleEventEmitter'
      )

      const agent = graph.getDependency<Agent>(CORE_DEP_KEYS.AGENT)

      if (!agent) return

      let lastTickTime = Date.now()

      const onTickEvent = () => {
        const event = agent?.formatEvent<{}>({
          content: '',
          eventName: 'tick',
          sender: agent.id,
          data: {},
          skipSave: true,
        })

        // handle state, but don't store the event
        handleState(event, false)

        const currentTime = Date.now()
        const deltaSeconds = (currentTime - lastTickTime) * 0.001
        write('deltaSeconds', deltaSeconds)
        commit('flow', () => {
          finish()
        })
        lastTickTime = currentTime
      }

      lifecycleEventEmitter?.tickEvent.addListener(onTickEvent)

      return {
        onTickEvent,
      }
    },
    dispose: ({ graph, state }) => {
      const lifecycleEventEmitter = graph.getDependency<ILifecycleEventEmitter>(
        'ILifecycleEventEmitter'
      )

      if (!lifecycleEventEmitter || !state.onTickEvent) return {}

      lifecycleEventEmitter?.tickEvent.removeListener(state.onTickEvent)
      lifecycleEventEmitter?.tickEvent.clear()

      return {
        onTickEvent: undefined,
      }
    },
  }
)

// init: ({ state, commit, write, graph: { getDependency } }) => {
//   Assert.mustBeTrue(state.onTickEvent === undefined)
//   let lastTickTime = Date.now()
//   const onTickEvent = () => {
//     const currentTime = Date.now()
//     const deltaSeconds = (currentTime - lastTickTime) * 0.001
//     write('deltaSeconds', deltaSeconds)
//     commit('flow')
//     lastTickTime = currentTime
//   }

//   const lifecycleEventEmitter = getDependency<ILifecycleEventEmitter>(
//     'ILifecycleEventEmitter'
//   )

//   lifecycleEventEmitter?.tickEvent.addListener(onTickEvent)

//   return {
//     onTickEvent,
//   }
// },
