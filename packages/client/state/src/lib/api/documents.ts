import { rootApi } from './api'

export const documentsApi = rootApi.injectEndpoints({
  endpoints: builder => ({
    getDocuments: builder.query({
      providesTags: ['Documents'],
      query: () => ({
        url: `documents`,
      }),
    }),
    getDocument: builder.query({
      providesTags: ['Document'],
      query: ({ documentId }) => {
        return {
          url: `documents?id=${documentId}`,
          params: {},
        }
      },
    }),
    getDocumentById: builder.query({
      providesTags: ['Document'],
      query: ({ documentId }) => {
        return {
          url: `documents?id=${documentId}`,
          params: {},
        }
      },
    }),
    createDocument: builder.mutation({
      invalidatesTags: ['Documents'],
      query: document => ({
        url: `documents`,
        method: 'POST',
        body: document,
      }),
    }),
    updateDocument: builder.mutation({
      invalidatesTags: ['Document', 'Documents'],
      query: document => {
        return {
          url: `documents/${document.id}`,
          method: 'PATCH',
          body: document,
        }
      },
    }),
    deleteDocument: builder.mutation({
      invalidatesTags: ['Document', 'Documents'],
      query: ({ documentId }) => ({
        url: `documents?id=${documentId}`,
        method: 'DELETE',
      }),
    }),
  }),
})

export const {
  useGetDocumentsQuery,
  useGetDocumentQuery,
  useGetDocumentByIdQuery,
  useLazyGetDocumentByIdQuery,
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
} = documentsApi
