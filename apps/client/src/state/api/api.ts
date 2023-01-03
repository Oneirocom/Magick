import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { thothApiRootUrl } from '../../config'
// initialize an empty api service that we'll inject endpoints into later as needed
export const rootApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: thothApiRootUrl,
  }),
  tagTypes: ['Spell', 'Spells', 'Version'],
  endpoints: () => ({}),
})
