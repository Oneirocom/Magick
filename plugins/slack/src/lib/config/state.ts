import type { PluginStateType } from 'plugin-state'
import { z } from 'zod'

export type SlackAgentContext = {}

export interface SlackPluginState extends PluginStateType {
  enabled: boolean
  context: SlackAgentContext
}

export const slackDefaultState: SlackPluginState = {
  enabled: false,
  context: {},
}

export const slackPluginStateSchema = z.object({
  enabled: z.boolean(),
  context: z.object({}),
})

// parse but don't validate
export const parseSlackPluginState = (state: unknown) => {
  return slackPluginStateSchema.safeParse(state)
}

// validate and parse
export const validateSlackPluginState = (state: unknown) => {
  return slackPluginStateSchema.parse(state)
}
