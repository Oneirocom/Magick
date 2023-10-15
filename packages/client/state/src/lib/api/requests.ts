import { rootApi } from './api'

export const requestApi = rootApi.injectEndpoints({
  endpoints: builder => ({
    getRequests: builder.query({
      providesTags: ['Requests'],
      query: () => ({
        url: `requests`,
      }),
    }),
    getRequest: builder.query({
      providesTags: ['Request'],
      query: ({ requestId }) => {
        return {
          url: `requests?requestId=${requestId}`,
          params: {},
        }
      },
    }),
    getRequestById: builder.query({
      providesTags: ['Request'],
      query: ({ requestId }) => {
        return {
          url: `requests/${requestId}`,
          params: {},
        }
      },
    }),
    createRequest: builder.mutation({
      invalidatesTags: ['Requests'],
      query: request => ({
        url: `requests`,
        method: 'POST',
        body: request,
      }),
    }),
    updateRequest: builder.mutation({
      invalidatesTags: ['Request', 'Requests'],
      query: request => {
        return {
          url: `requests/${request.id}`,
          method: 'PATCH',
          body: request,
        }
      },
    }),
    deleteRequest: builder.mutation({
      invalidatesTags: ['Request', 'Requests'],
      query: ({ requestId }) => ({
        url: `requests/${requestId}`,
        method: 'DELETE',
      }),
    }),
  }),
})
