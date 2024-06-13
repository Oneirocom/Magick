import { ToggleRunAllData } from 'server/core'
import { rootApi } from './api'

export const agentManagerApi = rootApi.injectEndpoints({
  endpoints: builder => ({
    toggleRunAll: builder.mutation<
      { runningStatus: boolean },
      ToggleRunAllData
    >({
      query: data => ({
        url: 'agentManager/toggleRunAll',
        method: 'POST',
        body: data,
      }),
    }),
  }),
})

export const { useToggleRunAllMutation } = agentManagerApi
