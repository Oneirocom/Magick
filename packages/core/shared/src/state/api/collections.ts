import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { QueryReturnValue } from '@reduxjs/toolkit/dist/query/baseQueryTypes'

import { rootApi } from './api'
import { CollectionInterface } from '@magickml/core'
import md5 from 'md5'

export const collectionApi = rootApi.injectEndpoints({
  endpoints: builder => ({
    // Api endpoint for getting collections
    getCollections: builder.query({
      providesTags: ['Collections'],
      query: () => 'collections', // Replace with the actual API endpoint for collections
    }),
    // Api endpoint for getting a collection by ID
    getCollection: builder.query({
      providesTags: ['Collection'],
      query: ({ collectionId }) => ({
        url: `collections/${collectionId}`, // Replace with the actual API endpoint for a single collection
      }),
    }),
    // Api endpoint for creating a new collection
    createCollection: builder.mutation({
      invalidatesTags: ['Collections'],
      query: collectionData => ({
        url: 'collections',
        method: 'POST',
        body: collectionData,
      }),
    }),
    // Api endpoint for updating a collection
    updateCollection: builder.mutation({
      invalidatesTags: ['Collection'],
      query: ({ collectionId, collectionData }) => ({
        url: `collections/${collectionId}`, // Replace with the actual API endpoint for updating a collection
        method: 'PUT', // Use the appropriate HTTP method
        body: collectionData,
      }),
    }),
    // Api endpoint for deleting a collection
    deleteCollection: builder.mutation({
      invalidatesTags: ['Collections'],
      query: ({ collectionId }) => ({
        url: `collections/${collectionId}`, // Replace with the actual API endpoint for deleting a collection
        method: 'DELETE',
      }),
    }),
  }),
})

// Export the generated hooks for each API endpoint
export const {
  useGetCollectionsQuery,
  useGetCollectionQuery,
  useCreateCollectionMutation,
  useUpdateCollectionMutation,
  useDeleteCollectionMutation,
} = collectionApi
