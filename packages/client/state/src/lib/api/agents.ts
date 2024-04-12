import { ISeraphEvent } from 'servicesShared'
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
    createAgentRelease: builder.mutation({
      invalidatesTags: ['Agent', 'Agents', 'SpellReleases'],
      query: agent => ({
        url: `agents/createRelease`,
        method: 'POST',
        body: agent,
      }),
    }),
    getAgentSeraphEvents: builder.query<ISeraphEvent[], { agentId: string }>({
      providesTags: ['AgentSeraphEvents'],
      query: agentId => {
        return {
          url: `agents/seraphEvents?agentId=${agentId}`,
          params: {},
        }
      },
    }),
    createAgentSeraphEvent: builder.mutation<boolean, ISeraphEvent>({
      invalidatesTags: ['AgentSeraphEvents'],
      query: seraphEvent => {
        console.log('createAgentSeraphEvent', seraphEvent)
        return {
          url: `agents/createSeraphEvent`,
          method: 'POST',
          body: seraphEvent,
        }
      },
    }),
  }),
})

export const {
  useGetAgentsQuery,
  useGetAgentQuery,
  useGetAgentByIdQuery,
  useCreateAgentMutation,
  useCreateAgentReleaseMutation,
  useUpdateAgentMutation,
  useDeleteAgentMutation,
  useLazyGetAgentQuery,
  useLazyGetAgentByIdQuery,
  useLazyGetAgentsQuery,
  useGetAgentSeraphEventsQuery,
  useCreateAgentSeraphEventMutation,
} = agentApi
