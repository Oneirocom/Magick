import type { PluginStateType } from 'plugin-state'
import { z } from 'zod'
import type { App } from '@slack/bolt'
import { slackPluginName } from './constants'

type SlackAuthTest = Awaited<ReturnType<App['client']['auth']['test']>>

export type SlackAgentContext = {
  id: string | undefined
  username: string | undefined
  authTest: SlackAuthTest | undefined
  platform: 'slack'
}

export interface SlackPluginState extends PluginStateType {
  enabled: boolean
  context: SlackAgentContext
}

export const slackDefaultState: SlackPluginState = {
  enabled: false,
  context: {
    id: '',
    username: '',
    authTest: undefined,
    platform: slackPluginName,
  },
}

export const slackPluginStateSchema = z.object({
  enabled: z.boolean(),
  context: z.object({
    username: z.string(),
    id: z.string(),
    authTest: z.record(z.unknown()).optional(),
    platform: z.literal(slackPluginName),
  }),
})

// parse but don't validate
export const parseSlackPluginState = (state: unknown) => {
  return slackPluginStateSchema.safeParse(state)
}

// validate and parse
export const validateSlackPluginState = (state: unknown) => {
  return slackPluginStateSchema.parse(state)
}
