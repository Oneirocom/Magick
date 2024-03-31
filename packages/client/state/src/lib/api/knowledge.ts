import { rootApi } from './api'
import type { Prisma } from '@magickml/server-db'

export type KnowledgeItem = Prisma.$knowledgePayload['scalars']
export interface KnowledgeResponse {
  total: number
  limit: number
  skip: number
  data: KnowledgeItem[]
}

export const knowledgeApi = rootApi.injectEndpoints({
  endpoints: builder => ({
    getKnowledge: builder.query<
      KnowledgeResponse,
      { limit?: number; skip?: number }
    >({
      providesTags: ['Knowledge'],
      query: ({ limit = 1000, skip = 0 }) => ({
        url: `knowledge`,
        params: { limit, skip },
      }),
    }),
    getOneKnowledge: builder.query<KnowledgeItem, { knowledgeId: string }>({
      providesTags: ['OneKnowledge'],
      query: ({ knowledgeId }) => ({
        url: `knowledge/${knowledgeId}`,
        params: {},
      }),
    }),
    getKnowledgeById: builder.query<KnowledgeItem, { knowledgeId: string }>({
      providesTags: ['OneKnowledge'],
      query: ({ knowledgeId }) => ({
        url: `knowledge/${knowledgeId}`,
        params: {},
      }),
    }),
    createKnowledge: builder.mutation<
      KnowledgeItem,
      { knowledge: Omit<KnowledgeItem, 'id' | 'createdAt' | 'updatedAt'> }
    >({
      invalidatesTags: ['Knowledge'],
      query: ({ knowledge }) => ({
        url: `knowledge`,
        method: 'POST',
        body: knowledge,
      }),
    }),
    updateKnowledge: builder.mutation<
      KnowledgeItem,
      { knowledge: Partial<KnowledgeItem> }
    >({
      invalidatesTags: ['Knowledge', 'OneKnowledge'],
      query: ({ knowledge }) => ({
        url: `knowledge/${knowledge.id}`,
        method: 'PATCH',
        body: knowledge,
      }),
    }),
    deleteKnowledge: builder.mutation<void, { knowledgeId: string }>({
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
