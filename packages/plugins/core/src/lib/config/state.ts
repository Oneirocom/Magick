import type { PluginStateType } from '@magickml/agent-plugin-state'
import { z } from 'zod'

export type CoreAgentContext = {
  id: string | undefined
  name: string | undefined
  description: string | undefined
}

export interface CorePluginState extends PluginStateType {
  enabled: boolean
  context: CoreAgentContext
}

export const coreDefaultState: CorePluginState = {
  enabled: true,
  context: {
    id: '',
    name: '',
    description: '',
  },
}

export const corePluginStateSchema = z.object({
  enabled: z.boolean(),
  context: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
  }),
})

// parse but don't validate
export const parseCorePluginState = (state: unknown) => {
  return corePluginStateSchema.safeParse(state)
}

// validate and parse
export const validateCorePluginState = (state: unknown) => {
  return corePluginStateSchema.parse(state)
}
