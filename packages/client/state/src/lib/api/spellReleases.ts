import { rootApi } from './api'

export const spellReleaseApi = rootApi.injectEndpoints({
  endpoints: builder => ({
    getSpellReleasesByAgentId: builder.query({
      providesTags: ['SpellReleases'],
      query: ({ agentId }) => ({
        url: `spellReleases?agentId=${agentId}`,
      }),
    }),
  }),
})

export const { useGetSpellReleasesByAgentIdQuery } = spellReleaseApi
