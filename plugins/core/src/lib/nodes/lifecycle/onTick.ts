import { ILifecycleEventEmitter, NodeCategory } from '@magickml/behave-graph'
import { makeMagickEventNodeDefinition } from 'server/grimoire'
import { CORE_DEP_KEYS } from '../../config'
import { Agent } from 'server/agents'

type State = {
  lastTickTime: number
}

const makeInitialState = (): State => ({
  lastTickTime: Date.now(),
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
    customListener: (getDependency, onStartEvent) => {
      const agent = getDependency<Agent>(CORE_DEP_KEYS.AGENT)

      console.log('I AM A LISTSNER')

      if (!agent) return

      const lifecycleEventEmitter = getDependency<ILifecycleEventEmitter>(
        'ILifecycleEventEmitter'
      )

      lifecycleEventEmitter?.tickEvent.addListener(() => {
        const event = agent?.formatEvent<{}>({
          content: '',
          eventName: 'tick',
          sender: agent.id,
          data: {},
        })

        onStartEvent(event)
      })
    },
    handleEvent: (event, { write, commit, state }) => {
      const currentTime = Date.now()
      const deltaSeconds = (currentTime - state.lastTickTime) * 0.001
      write('deltaSeconds', deltaSeconds)
      commit('flow')
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
