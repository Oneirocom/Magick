import { rootApi } from './api'

export const agentChannelsApi = rootApi.injectEndpoints({
  endpoints: builder => ({
    getChannels: builder.query({
      providesTags: ['AgentChannels'],
      query: ({ agentId, limit, page }) => ({
        url: `agentChannels?agentId=${agentId}&limit=${limit}&page=${page}`,
        method: 'GET',
      }),
    }),
    toggleChannelActive: builder.mutation({
      invalidatesTags: ['AgentChannels'],
      query: ({ channelId, channelActive }) => ({
        url: `agentChannels/${channelId}`,
        method: 'PATCH',
        body: { channelActive },
      }),
    }),
  }),
})

export const { useGetChannelsQuery, useToggleChannelActiveMutation } =
  agentChannelsApi
