import { NodeCategory, makeAsyncNodeDefinition } from '@magickml/behave-graph'
import type { EmbedderClient } from '@magickml/embedder-client-ts'
import { CORE_DEP_KEYS } from '@magickml/shared-services'

type InitialState = {
  isBusy: boolean
  isCancelled: boolean
}

const makeInitialState = (): InitialState => {
  return {
    isBusy: false,
    isCancelled: false,
  }
}

export const waitForEmbedderJob = makeAsyncNodeDefinition({
  typeName: 'knowledge/embedder/awaitLoader',
  category: NodeCategory.Action,
  label: 'Await Loader',
  configuration: {
    checkIntervalMs: {
      valueType: 'integer',
      defaultValue: 500,
    },
  },
  in: {
    flow: {
      valueType: 'flow',
    },
    cancel: {
      valueType: 'flow', // Trigger input to cancel the operation
    },
    loaderId: {
      valueType: 'string',
    },
    packId: {
      valueType: 'string',
    },
  },
  out: {
    completed: 'flow',
    failed: 'flow',
    pending: 'flow',
    processing: 'flow',
    lastStatus: 'string',
    result: 'object',
  },
  initialState: makeInitialState(),
  triggered: async ({
    commit,
    read,
    write,
    graph,
    state,
    finished = () => {},
    configuration,
    triggeringSocketName,
  }) => {
    if (triggeringSocketName === 'cancel') {
      console.log('Cancellation requested.')
      state.isBusy = false
      finished()
      return state
    }

    const loaderId = read('loaderId') as string
    const packId = read('packId') as string
    const interval = Number(configuration.checkIntervalMs) || 500

    if (!loaderId) {
      console.error('Job ID not provided')
      commit('failed')
      finished()
      return state
    }

    const embedder = graph.getDependency<EmbedderClient>(
      CORE_DEP_KEYS.EMBEDDER_CLIENT
    )

    if (state.isBusy) {
      console.error('Node is already busy')
      return state
    }

    if (!embedder) {
      console.error('Embedder client not found')
      state.isBusy = false
      commit('failed')
      finished()
      return state
    }

    state.isBusy = true

    while (state.isBusy) {
      console.log('Polling job status...')

      let loaderRes
      try {
        loaderRes = await embedder.getLoader({
          params: { id: packId, loaderId },
        })
        console.log('loaderResponse', loaderRes.status)
      } catch (err) {
        console.error('Error polling loader:', err)
        state.isBusy = false
        commit('failed')
        finished()
        return state
      }

      const loaderStatus = loaderRes.status

      if (loaderStatus === 'completed') {
        state.isBusy = false
        write('result', loaderRes)
        commit('completed')
        finished()
        return state
      }

      if (loaderStatus === 'failed') {
        state.isBusy = false
        commit('failed')
        finished()
        return state
      }

      await new Promise(resolve => setTimeout(resolve, interval))
    }

    return state
  },
  dispose: () => {
    return {
      isCancelled: false,
      isBusy: false,
    }
  },
})
