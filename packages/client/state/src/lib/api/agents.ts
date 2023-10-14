import { rootApi } from './api'

export const agentApi = rootApi.injectEndpoints({
  endpoints: builder => ({
    getAgents: builder.query({
      providesTags: ['Agents'],
      query: () => ({
        url: `agents`,
      }),
    }),
    getAgent: builder.query({
      providesTags: ['Agent'],
      query: ({ agentName }) => {
        return {
          url: `agents?name=${agentName}`,
          params: {},
        }
      },
    }),
    getAgentById: builder.query({
      providesTags: ['Agent'],
      query: ({ agentId }) => {
        return {
          url: `agents/${agentId}`,
          params: {},
        }
      },
    }),
    createAgent: builder.mutation({
      invalidatesTags: ['Agents'],
      query: agent => ({
        url: `agents`,
        method: 'POST',
        body: agent,
      }),
    }),
    updateAgent: builder.mutation({
      invalidatesTags: ['Agent', 'Agents'],
      query: agent => {
        return {
          url: `agents/${agent.id}`,
          method: 'PATCH',
          body: agent,
        }
      },
    }),
    deleteAgent: builder.mutation({
      invalidatesTags: ['Agent', 'Agents'],
      query: ({ agentId }) => ({
        url: `agents/${agentId}`,
        method: 'DELETE',
      }),
    }),
  }),
})

export const {
  useGetAgentsQuery,
  useGetAgentQuery,
  useGetAgentByIdQuery,
  useCreateAgentMutation,
  useUpdateAgentMutation,
  useDeleteAgentMutation,
  useLazyGetAgentQuery,
  useLazyGetAgentByIdQuery,
  useLazyGetAgentsQuery,
} = agentApi
