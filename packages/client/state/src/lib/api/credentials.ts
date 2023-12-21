import { rootApi } from './api'

export const credentialsApi = rootApi.injectEndpoints({
  endpoints: builder => ({
    // project scoped
    getCredentials: builder.query({
      providesTags: ['Credentials'],
      query: () => ({
        url: `credentials`,
        method: 'GET',
      }),
    }),

    createCredential: builder.mutation({
      invalidatesTags: ['Credentials'],
      query: credential => ({
        url: `credentials`,
        method: 'POST',
        body: credential,
      }),
    }),

    deleteCredential: builder.mutation({
      invalidatesTags: ['Credential', 'Credentials'],
      query: ({ projectId }) => ({
        url: `credentials/${projectId}`,
        method: 'DELETE',
      }),
    }),

    // agent scoped
    linkCredentialToAgent: builder.mutation({
      invalidatesTags: ['Credentials'],
      query: ({ agentId, credentialId }) => ({
        url: `credentials/link?agentId=${agentId}&credentialId=${credentialId}`,
        method: 'GET',
      }),
    }),

    listAgentCredentials: builder.query({
      providesTags: ['Credentials'],
      query: ({ agentId }) => ({
        url: `credentials/agent?agentId=${agentId}`,
        method: 'GET',
      }),
    }),

    removeAgentCredential: builder.mutation({
      invalidatesTags: ['Credential', 'Credentials'],
      query: ({ agentId, credentialId }) => ({
        url: `credentials/agent?agentId=${agentId}&credentialId=${credentialId}`,
        method: 'DELETE',
      }),
    }),
  }),
})

export const {
  useGetCredentialsQuery,
  useCreateCredentialMutation,
  useDeleteCredentialMutation,
  useLinkCredentialToAgentMutation,
  useListAgentCredentialsQuery,
  useRemoveAgentCredentialMutation,
} = credentialsApi
