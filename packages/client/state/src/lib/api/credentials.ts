import { rootApi } from './api'

export const credentialsApi = rootApi.injectEndpoints({
  endpoints: builder => ({
    getCredentials: builder.query({
      providesTags: ['Credentials'],
      query: () => ({
        url: `credentials`,
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
  }),
})

export const {
  useGetCredentialsQuery,
  useCreateCredentialMutation,
  useDeleteCredentialMutation,
} = credentialsApi
