import { rootApi } from './api'
import { feathersClient } from 'client/feathers-client'

export const eventsApi = rootApi.injectEndpoints({
  endpoints: builder => ({
    getEvents: builder.query({
      providesTags: ['Events'],
      query: () => ({
        url: `events`,
      }),
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        await cacheDataLoaded

        const client = feathersClient.getClient()

        const listener = (event: any) => {
          // we need to validate if the event matches the current project we are on.
          // if it does not we should not update the cache.

          if (event.embedding) delete event.embedding

          updateCachedData(draft => {
            draft.events.push(event)
          })
        }

        client.service('events').on('created', listener)

        await cacheEntryRemoved

        client.service('events').off('created', listener)
      },
    }),
    getEvent: builder.query({
      providesTags: ['Event'],
      query: ({ eventId, projectId }) => {
        return {
          url: `events/${eventId}`,
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
      query: ({ query }) => ({
        url: `events?${query}`,
        method: 'DELETE',
      }),
    }),
    deleteEvent: builder.mutation({
      invalidatesTags: ['Event', 'Events'],
      query: ({ eventId }) => ({
        url: `events/${eventId}`,
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
