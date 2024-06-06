import { NodeCategory, makeAsyncNodeDefinition } from '@magickml/behave-graph'
import type { EmbedderClient } from '@magickml/embedder/client/ts'
import { CORE_DEP_KEYS } from '../../config'

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
  typeName: 'knowledge/embedder/waitForJob',
  category: NodeCategory.Action,
  label: 'Wait for Job Completion',
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
    jobId: {
      valueType: 'string',
    },
    cancel: {
      valueType: 'flow', // Trigger input to cancel the operation
    },
  },
  out: {
    completed: 'flow',
    failed: 'flow',
    pending: 'flow',
    processing: 'flow',
    lastStatus: 'string',
  },
  initialState: makeInitialState(),
  triggered: async ({
    commit,
    read,
    graph,
    state,
    configuration,
    triggeringSocketName,
  }) => {
    const jobId = read('jobId') as string
    const interval = Number(configuration.checkIntervalMs) || 500

    if (!jobId) {
      console.error('Job ID not provided')
      commit('failed')
      return state
    }

    const embedder = graph.getDependency<EmbedderClient>(
      CORE_DEP_KEYS.EMBEDDER_CLIENT
    )

    if (triggeringSocketName === 'cancel') {
      console.log('Cancellation requested.')
      state.isCancelled = true
      return state
    }

    if (state.isBusy) {
      console.error('Node is already busy')
      return state
    }

    if (!embedder) {
      console.error('Embedder client not found')
      return state
    }

    state.isBusy = true

    const pollJobStatus = async (previousStatus = '') => {
      if (state.isCancelled) {
        console.log('Operation cancelled.')
        state.isBusy = false
        commit('failed')
        return
      }

      try {
        await new Promise(resolve => setTimeout(resolve, interval || 1000))
        const jobRes = await embedder.getJobById({ params: { id: jobId } })
        const jobStatus = jobRes.status

        if (
          state.isBusy &&
          jobStatus !== 'completed' &&
          jobStatus !== 'failed'
        ) {
          if (jobStatus !== previousStatus) {
            commit(jobStatus, () => pollJobStatus(jobStatus))
          } else {
            pollJobStatus(previousStatus) // Continue polling without committing if status hasn't changed
          }
        } else if (jobStatus === 'completed') {
          commit('completed')
        } else if (jobStatus === 'failed') {
          commit('failed')
        }
      } catch (error) {
        console.error('Error waiting for job completion:', error)
        commit('failed')
      }
    }

    pollJobStatus() // Start the polling loop

    return state
  },
  dispose: () => {
    return {
      isCancelled: false,
      isBusy: false,
    }
  },
})
