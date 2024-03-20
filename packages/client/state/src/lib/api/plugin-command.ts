import { z } from 'zod'
import { rootApi } from './api'

export const SendCommandBody = z.object({
  agentId: z.string(),
  plugin: z.string(),
  command: z.string(),
  payload: z.record(z.unknown()).optional(),
})

export type SendCommandBodyType = z.infer<typeof SendCommandBody>

export const pluginCommandApi = rootApi.injectEndpoints({
  endpoints: builder => ({
    sendCommand: builder.mutation<
      SendCommandBodyType[],
      SendCommandBodyType & { projectId: string }
    >({
      invalidatesTags: ['PluginCommand', 'PluginState'],
      query: ({ agentId, projectId, plugin, command, payload }) => ({
        url: `command?projectId=${projectId}`,
        method: 'POST',
        body: { agentId, plugin, command, payload },
      }),
    }),
  }),
})
export const { useSendCommandMutation } = pluginCommandApi
