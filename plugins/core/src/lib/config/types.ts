import { EventTypes } from 'communication'
import { EventPayload } from 'server/plugin'

export type CorePluginEvents = {
  [EventTypes.ON_MESSAGE]: (payload: EventPayload) => void
}
