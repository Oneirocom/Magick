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
    deleteChannel: builder.mutation({
      invalidatesTags: ['AgentChannels'],
      query: ({ channelId }) => ({
        url: `agentChannels/${channelId}`,
        method: 'DELETE',
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

export const {
  useGetChannelsQuery,
  useToggleChannelActiveMutation,
  useDeleteChannelMutation,
} = agentChannelsApi
