import { rootApi } from './api'
import { feathersClient } from 'client/feathers-client'

export const eventsApi = rootApi.injectEndpoints({
  endpoints: builder => ({
    getEvents: builder.query({
      providesTags: ['GraphEvents'],
      query: agentId => ({
        url: `graphEvents?agentId=${agentId}`,
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

          if (event?.embedding) delete event.embedding

          updateCachedData(draft => {
            draft.events.push(event)
          })
        }

        client.service('graphEvents').on('created', listener)

        await cacheEntryRemoved

        client.service('graphEvents').off('created', listener)
      },
    }),
    getEvent: builder.query({
      providesTags: ['GraphEvent'],
      query: ({ eventId }) => {
        return {
          url: `graphEvents/${eventId}`,
          params: {},
        }
      },
    }),
    createEvent: builder.mutation({
      invalidatesTags: ['GraphEvents'],
      query: event => ({
        url: `graphEvents`,
        method: 'POST',
        body: event,
      }),
    }),
    updateEvent: builder.mutation({
      invalidatesTags: ['GraphEvent', 'GraphEvents'],
      query: event => {
        return {
          url: `graphEvents/${event.id}`,
          method: 'PATCH',
          body: event,
        }
      },
    }),
    deleteEvents: builder.mutation({
      invalidatesTags: ['GraphEvents'],
      query: ({ query }) => ({
        url: `graphEvents?${query}`,
        method: 'DELETE',
      }),
    }),
    deleteEvent: builder.mutation({
      invalidatesTags: ['GraphEvent', 'GraphEvents'],
      query: ({ eventId }) => ({
        url: `graphEvents/${eventId}`,
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
