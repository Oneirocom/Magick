import { ON_MESSAGE } from 'communication'
import { EventPayload } from 'server/plugin'

// add any state that you want to persist between restarts here
export interface CorePluginState extends Record<string, unknown> {}

export type CorePluginEvents = {
  [ON_MESSAGE]: (payload: EventPayload) => void
}
