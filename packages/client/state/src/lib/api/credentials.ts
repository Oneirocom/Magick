import { rootApi } from './api'

export type Credential = {
  id: string
  projectId: string
  name: string
  serviceType: string
  credentialType: string
  description: null | string
  created_at: string
  updated_at: string
}

export type CredentialsWithValue = Credential & { value: string }
export type AgentCredential = {
  agentId: string
  credentialId: string
  created_at: string
  updated_at: string
}

export const credentialsApi = rootApi.injectEndpoints({
  endpoints: builder => ({
    // project scoped
    listCredentials: builder.query<Credential[], { projectId: string }>({
      providesTags: ['Credentials'],
      query: args => ({
        url: `credentials?projectId=${args.projectId}`,
        method: 'GET',
      }),
    }),

    createCredential: builder.mutation<
      Credential,
      Partial<CredentialsWithValue>
    >({
      invalidatesTags: ['Credentials'],
      query: credential => ({
        url: `credentials`,
        method: 'POST',
        body: credential,
      }),
    }),

    deleteCredential: builder.mutation<
      void,
      { projectId: string; credentialId: string }
    >({
      invalidatesTags: ['Credentials'],
      query: ({ projectId, credentialId }) => ({
        url: `credentials/${credentialId}?projectId=${projectId}`,
        method: 'DELETE',
      }),
    }),

    // agent scoped
    listAgentCredentials: builder.query<
      AgentCredential[],
      { agentId: string; projectId: string }
    >({
      providesTags: ['Credentials'],
      query: ({ agentId }) => ({
        url: `credentials/agent?agentId=${agentId}`,
        method: 'GET',
      }),
    }),

    linkAgentCredential: builder.mutation<
      void,
      { agentId: string; credentialId: string; projectId: string }
    >({
      invalidatesTags: ['Credentials'],
      query: ({ agentId, credentialId }) => ({
        url: `credentials/link?agentId=${agentId}&credentialId=${credentialId}`,
        method: 'GET',
      }),
    }),

    unlinkCredentialFromAgent: builder.mutation<
      void,
      { agentId: string; credentialId: string; projectId: string }
    >({
      invalidatesTags: ['Credentials'],
      query: ({ agentId, credentialId }) => ({
        url: `credentials/agent?agentId=${agentId}&credentialId=${credentialId}`,
        method: 'DELETE',
      }),
    }),
  }),
})

export const {
  useListCredentialsQuery,
  useCreateCredentialMutation,
  useDeleteCredentialMutation,
  useListAgentCredentialsQuery,
  useLinkAgentCredentialMutation,
  useUnlinkCredentialFromAgentMutation,
} = credentialsApi
