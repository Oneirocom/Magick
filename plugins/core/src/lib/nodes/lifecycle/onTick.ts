import { ILifecycleEventEmitter, NodeCategory } from '@magickml/behave-graph'
import { makeMagickEventNodeDefinition } from 'server/grimoire'

type State = {
  onTickEvent?: (() => void) | undefined
  lastTickTime: number
}

const makeInitialState = (): State => ({
  lastTickTime: Date.now(),
})

export const LifecycleOnTick = makeMagickEventNodeDefinition(
  {
    typeName: 'lifecycle/onTick',
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
      const lifecycleEventEmitter = getDependency<ILifecycleEventEmitter>(
        'ILifecycleEventEmitter'
      )

      lifecycleEventEmitter?.tickEvent.addListener(() => {
        onStartEvent()
      })
    },
    handleEvent: (event, { write, commit, state }) => {
      const { lastTickTime } = state
      const currentTime = Date.now()
      const deltaSeconds = (currentTime - lastTickTime) * 0.001
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
