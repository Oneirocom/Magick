import { NodeCategory, makeAsyncNodeDefinition } from '@magickml/behave-graph'

export const flowSplit = makeAsyncNodeDefinition({
  typeName: 'flow/split',
  otherTypeNames: ['flow/split'],
  category: NodeCategory.Flow,
  label: 'Flow Split',
  configuration: {},
  in: {
    flow: {
      valueType: 'flow',
    },
  },
  out: {
    flow1: 'flow',
    flow2: 'flow',
    done: 'flow',
  },
  initialState: {
    bothDone: true,
    flow1Done: true,
    flow2Done: true,
  },
  triggered: ({ state, finished = () => {}, commit }) => {
    if (!state.bothDone) {
      return state
    }

    state.bothDone = false
    state.flow1Done = false
    state.flow2Done = false

    commit('flow1', () => {
      state.flow1Done = true
      if (state.flow2Done) {
        state.bothDone = true
        finished()
        commit('done')
      }
    })

    commit('flow2', () => {
      state.flow2Done = true
      if (state.flow1Done) {
        state.bothDone = true
        finished()
        commit('done')
      }
    })

    return state
  },
  dispose: () => {
    return {
      bothDone: true,
      flow1Done: true,
      flow2Done: true,
    }
  },
})
