import { rootApi } from './api'
import { RecordInterface } from '@magickml/core'
export const recordApi = rootApi.injectEndpoints({
  endpoints: builder => ({
    // Api endpoint for getting records
    getRecords: builder.query({
      providesTags: ['Records'],
      query: ({ collectionId }) => ({
        url: collectionId ? `records?collectionId=${collectionId}` : 'records',
      }),
    }),

    // Api endpoint for getting a record by ID
    getRecord: builder.query({
      providesTags: ['Record'],
      query: ({ recordId }) => ({
        url: `records/${recordId}`,
      }),
    }),
    // Api endpoint for creating a new record
    createRecord: builder.mutation({
      invalidatesTags: ['Records'],
      query: recordData => ({
        url: 'records',
        method: 'POST',
        body: recordData,
      }),
    }),
    // Api endpoint for updating a record
    updateRecord: builder.mutation({
      invalidatesTags: ['Record'],
      query: ({ recordId, recordData }) => ({
        url: `records/${recordId}`,
        method: 'PUT',
        body: recordData,
      }),
    }),
    // Api endpoint for deleting a record
    deleteRecord: builder.mutation({
      invalidatesTags: ['Records'],
      query: ({ recordId }) => ({
        url: `records/${recordId}`,
        method: 'DELETE',
      }),
    }),
  }),
})

// Export the generated hooks for each API endpoint
export const {
  useGetRecordsQuery,
  useGetRecordQuery,
  useCreateRecordMutation,
  useUpdateRecordMutation,
  useDeleteRecordMutation,
} = recordApi
