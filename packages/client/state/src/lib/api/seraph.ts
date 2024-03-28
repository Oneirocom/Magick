import { ISeraphEvent } from 'servicesShared'
import { rootApi } from './api'
export const seraphApi = rootApi.injectEndpoints({
  endpoints: builder => ({
    getSeraphChatHistory: builder.query<ISeraphEvent[], { agentId: string }>({
      providesTags: ['SeraphChatHistory'],
      query: ({ agentId }) => ({
        url: `seraph/chatHistory?agentId=${agentId}`,
      }),
    }),
    createSeraphRequest: builder.mutation<
      { success: boolean; id: string },
      ISeraphEvent
    >({
      invalidatesTags: ['SeraphChatHistory'],
      query: seraphRequest => ({
        url: `seraph/request`,
        method: 'POST',
        body: seraphRequest,
      }),
    }),
  }),
})

export const { useGetSeraphChatHistoryQuery, useCreateSeraphRequestMutation } =
  seraphApi
