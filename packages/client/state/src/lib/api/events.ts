import { rootApi } from './api'

export const eventsApi = rootApi.injectEndpoints({
  endpoints: builder => ({
    getEvents: builder.query({
      providesTags: ['Events'],
      query: () => ({
        url: `events`,
      }),
    }),
    getEvent: builder.query({
      providesTags: ['Event'],
      query: ({ eventId, projectId }) => {
        return {
          url: `events?id=${eventId}`,
          params: {},
        }
      },
    }),
    createEvent: builder.mutation({
      invalidatesTags: ['Events'],
      query: event => ({
        url: `events`,
        method: 'POST',
        body: event,
      }),
    }),
    updateEvent: builder.mutation({
      invalidatesTags: ['Event', 'Events'],
      query: event => {
        return {
          url: `events/${event.id}`,
          method: 'PATCH',
          body: event,
        }
      },
    }),
    deleteEvents: builder.mutation({
      invalidatesTags: ['Events'],
      query: ({ queryString }) => ({
        url: `events?${queryString}`,
        method: 'DELETE',
      }),
    }),
    deleteEvent: builder.mutation({
      invalidatesTags: ['Event', 'Events'],
      query: ({ eventId }) => ({
        url: `events?id=${eventId}`,
        method: 'DELETE',
      }),
    }),
  }),
})

export const {
  useGetEventsQuery,
  useGetEventQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useDeleteEventsMutation,
} = eventsApi
