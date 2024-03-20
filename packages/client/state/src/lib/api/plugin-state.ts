import { rootApi } from './api'
import type { Prisma } from '@magickml/server-db'

export type PluginState = Prisma.$pluginStatePayload['scalars']

export const pluginStateApi = rootApi.injectEndpoints({
  endpoints: builder => ({
    getPluginState: builder.query<
      PluginState[],
      { agentId: string; projectId: string }
    >({
      providesTags: ['PluginState'],
      query: args => ({
        url: `state?projectId=${args.projectId}&agentId=${args.agentId}`,
        method: 'GET',
      }),
    }),
  }),
})
export const { useGetPluginStateQuery } = pluginStateApi
