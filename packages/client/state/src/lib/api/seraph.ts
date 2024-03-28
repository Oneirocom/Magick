import { rootApi } from './api'
export const seraphApi = rootApi.injectEndpoints({
  endpoints: builder => ({
    getSeraphChatHistory: builder.query({
      providesTags: ['SeraphChatHistory'],
      query: ({ agentId }) => ({
        url: `seraph/chatHistory?agentId=${agentId}`,
      }),
    }),
    createSeraphRequest: builder.mutation({
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
