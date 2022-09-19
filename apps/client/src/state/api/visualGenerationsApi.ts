import { ImageCacheResponse } from '@thothai/core/types'
import { rootApi } from './api'

export const visualGenerationsApi = rootApi.injectEndpoints({
  endpoints: builder => ({
    fetchFromImageCache: builder.mutation<
      ImageCacheResponse,
      { caption: string; cacheTag?: string; topK?: number }
    >({
      query: searchOptions => ({
        url: '/image/cache/lookup',
        method: 'POST',
        body: {
          ...searchOptions,
        },
      }),
    }),
  }),
})

export const { useFetchFromImageCacheMutation } = visualGenerationsApi
