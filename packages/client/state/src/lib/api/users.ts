import { rootApi } from './api'

export const usersApi = rootApi.injectEndpoints({
  endpoints: builder => ({
    getUser: builder.query({
      providesTags: ['User'],
      query: ({ projectId }) => {
        return {
          url: `/user/${projectId}`,
          method: 'GET',
        }
      },
    }),
  }),
})

export const { useGetUserQuery } = usersApi
