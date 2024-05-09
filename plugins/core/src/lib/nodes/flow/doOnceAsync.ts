import { NodeCategory } from '@magickml/behave-graph'
import { makeMagickAsyncNodeDefinition } from 'server/grimoire'

// based on Unreal Engine Blueprint DoN node

export const DoOnceAsync = makeMagickAsyncNodeDefinition({
  typeName: 'flow/doOnceAsync',
  label: 'DoOnceAsync',
  category: NodeCategory.Flow,
  in: {
    flow: 'flow',
    reset: 'flow',
  },
  out: {
    flow: 'flow',
    onReset: 'flow',
  },
  initialState: {
    firedOnce: false,
  },
  triggered: ({ commit, triggeringSocketName, state }) => {
    if (triggeringSocketName === 'reset') {
      commit('onReset')
      return { firedOnce: false }
    }

    if (!state.firedOnce) {
      commit('flow')
      return { firedOnce: true }
    }
    return state
  },
  dispose: () => ({ firedOnce: false }),
})
