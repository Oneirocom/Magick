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
      query: ({ agentName, projectId }) => {
        return {
          url: `agents?name=${agentName}&projectId=${projectId}`,
          params: {},
        }
      },
    }),
    getAgentById: builder.query({
      providesTags: ['Agent'],
      query: ({ agentId, projectId }) => {
        return {
          url: `agents?id=${agentId}&projectId=${projectId}`,
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
      query: ({ agentId, projectId }) => ({
        url: `agents?id=${agentId}&projectId=${projectId}`,
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
