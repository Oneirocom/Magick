import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

let rootApi = null // TODO: type this
export function getRootApi(options, token = null) {
  const apiUrl = options.apiUrl
  if (rootApi) return rootApi

  console.log('Builgin root API for the first time with token!', token)

  rootApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
      prepareHeaders: async headers => {
        console.log('Building headers with token', token)
        if (token) headers.set('authorization', `Bearer ${token}`)
        return headers
      },
      baseUrl: apiUrl,
    }),
    tagTypes: ['Spell', 'Spells', 'Version'],
    endpoints: () => ({}),
  })
  return rootApi
}
