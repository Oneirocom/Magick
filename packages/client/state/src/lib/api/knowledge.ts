import { rootApi } from './api'

export const knowledgeApi = rootApi.injectEndpoints({
  endpoints: builder => ({
    getKnowledge: builder.query({
      providesTags: ['Knowledge'],
      query: () => ({
        url: `knowledge`,
      }),
    }),
    getOneKnowledge: builder.query({
      providesTags: ['OneKnowledge'],
      query: ({ knowledgeId }) => {
        return {
          url: `knowledge/${knowledgeId}`,
          params: {},
        }
      },
    }),
    getKnowledgeById: builder.query({
      providesTags: ['OneKnowledge'],
      query: ({ knowledgeId }) => {
        return {
          url: `knowledge/${knowledgeId}`,
          params: {},
        }
      },
    }),
    createKnowledge: builder.mutation({
      invalidatesTags: ['Knowledge'],
      query: ({ knowledge }) => ({
        url: `knowledge`,
        method: 'POST',
        body: knowledge,
      }),
    }),
    updateKnowledge: builder.mutation({
      invalidatesTags: ['Knowledge', 'OneKnowledge'],
      query: ({ knowledge }) => {
        return {
          url: `knowledge/${knowledge.id}`,
          method: 'PATCH',
          body: knowledge,
        }
      },
    }),
    deleteKnowledge: builder.mutation({
      invalidatesTags: ['Knowledge', 'OneKnowledge'],
      query: ({ knowledgeId }) => ({
        url: `knowledge/${knowledgeId}`,
        method: 'DELETE',
      }),
    }),
  }),
})

export const {
  useGetKnowledgeQuery,
  useGetOneKnowledgeQuery,
  useGetKnowledgeByIdQuery,
  useLazyGetKnowledgeByIdQuery,
  useCreateKnowledgeMutation,
  useUpdateKnowledgeMutation,
  useDeleteKnowledgeMutation,
} = knowledgeApi
