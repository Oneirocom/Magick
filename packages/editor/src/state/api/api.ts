// GENERATED 
// Import necessary libraries and types from toolkit
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import { RootState } from '../store'

/**
 * Dynamic base query that can be used to create a Redux Toolkit Query API
 * with a dynamic API url and token based on the current state.
 *
 * @param args - The URL or FetchArgs containing the request information.
 * @param api - The Redux Toolkit Query API instance.
 * @param extraOptions - Any extra options provided during the request.
 * @returns A FetchBaseQueryError if apiUrl missing, otherwise the response of the request.
 */
const dynamicBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Get state from Redux store
  const state = api.getState() as RootState
  // Extract apiUrl and token from state
  const apiUrl = state.globalConfig.apiUrl
  const token = state.globalConfig.token

  // Handle scenarios where apiUrl is not present gracefully
  if (!apiUrl) {
    return {
      error: {
        status: 400,
        statusText: 'Bad Request',
        data: 'No apiUrl present',
      },
    }
  }

  // Create rawBaseQuery with provided apiUrl and token (if exists)
  const rawBaseQuery = fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: async headers => {
      if (token) headers.set('authorization', `Bearer ${token}`)
      return headers
    },
  })

  // Return rawBaseQuery result with provided args and extraOptions
  return rawBaseQuery(args, api, extraOptions)
}

/**
 * Creates a root API with a dynamic base query, appropriate reducerPath,
 * tagTypes, and empty endpoints.
 */
export const rootApi = createApi({
  reducerPath: 'api', // Set reducer path
  baseQuery: dynamicBaseQuery, // Use dynamicBaseQuery as baseQuery
  tagTypes: ['Spell', 'Spells', 'Version'], // Define tagTypes for invalidation
  endpoints: () => ({}), // Provide an empty object for endpoints
})