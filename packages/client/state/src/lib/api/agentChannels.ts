import { rootApi } from './api'

export const agentChannelsApi = rootApi.injectEndpoints({
  endpoints: builder => ({
    getChannels: builder.query({
      providesTags: ['AgentChannels'],
      query: () => ({
        url: `agentChannels`,
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
