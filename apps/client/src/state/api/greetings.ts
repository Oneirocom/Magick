import { rootApi } from "./api";

export const greetingsApi = rootApi.injectEndpoints({
  endpoints: builder => ({
    getGreetings: builder.query({
      providesTags: ['Greetings'],
      query: (enabled) => ({
        url: 'greetings',
        params: {
          enabled
        }
      })
    }),
    addGreeting: builder.mutation({
      invalidatesTags: ['Greetings'],
      query: greetingData => ({
        url: 'greetings',
        method: 'POST',
        body: greetingData
      })
    }),
    updateGreeting: builder.mutation({
      invalidatesTags: ['Greetings'],
      query: ({ id, data }) => ({
        url: `greetings/${id}`,
        method: 'PUT',
        body: data
      })
    }),
    deleteGreeting: builder.mutation({
      invalidatesTags: ['Greetings'],
      query: greetingId => ({
        url: `greetings/${greetingId}`,
        method: 'DELETE'
      })
    })
  })
})

export const {
  useGetGreetingsQuery,
  useAddGreetingMutation,
  useUpdateGreetingMutation,
  useDeleteGreetingMutation,
} = greetingsApi