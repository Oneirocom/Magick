import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getAuthHeader } from '../../contexts/AuthProvider'
import { thothApiRootUrl } from '../../config'
// initialize an empty api service that we'll inject endpoints into later as needed
export const rootApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: thothApiRootUrl,
    prepareHeaders: async headers => {
      const authHeader = await getAuthHeader()
      if (authHeader?.Authorization)
        headers.set('authorization', authHeader['Authorization'])
      return headers
    },
  }),
  tagTypes: ['Spell', 'Spells', 'Version', 'Greetings'],
  endpoints: () => ({}),
})
