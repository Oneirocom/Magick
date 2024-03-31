import { rootApi } from './api'

export enum ClientProjectPresignType {
  knowledge = 'knowledge',
}

export interface PresignedUrlRequest {
  id: string
  fileName: string
  type: ClientProjectPresignType
  projectId: string
}

export interface PresignedUrlResponse {
  url: string
  key: string
}

export const storageApi = rootApi.injectEndpoints({
  endpoints: builder => ({
    getPresignedUrl: builder.mutation<
      PresignedUrlResponse,
      PresignedUrlRequest
    >({
      query: data => ({
        url: '/presigned-url',
        method: 'POST',
        body: data,
        params: { projectId: data.projectId },
      }),
    }),
  }),
})

export const { useGetPresignedUrlMutation } = storageApi
