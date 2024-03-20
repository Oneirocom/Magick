import { rootApi } from './api'
import type { Prisma } from '@magickml/server-db'

export type Credential = Prisma.$credentialsPayload['scalars']

export type AgentCredentialV2 = Prisma.$agent_credentialsPayload['scalars'] & {
  credential: Partial<Credential>
}

export type CredentialsWithValue = Credential & { value: string }

export type AgentCredential = Prisma.$agent_credentialsPayload['scalars']

export const credentialsApi = rootApi.injectEndpoints({
  endpoints: builder => ({
    // new single method for both
    getCredentials: builder.query<
      AgentCredentialV2[],
      { projectId: string; agentId: string }
    >({
      providesTags: ['Credentials'],
      query: args => ({
        url: `credentials/v2/?projectId=${args.projectId}&agentId=${args.agentId}`,
        method: 'GET',
      }),
    }),

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
  useGetCredentialsQuery,
} = credentialsApi
