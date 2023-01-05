import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { magickApiRootUrl } from '../../config'
// initialize an empty api service that we'll inject endpoints into later as needed

console.log('magickApiRootUrl', magickApiRootUrl)
export const rootApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: magickApiRootUrl,
  }),
  tagTypes: ['Spell', 'Spells', 'Version'],
  endpoints: () => ({}),
})
