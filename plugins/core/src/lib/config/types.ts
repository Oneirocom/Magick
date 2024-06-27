import { EventTypes } from '@magickml/agent-communication'
import { EventPayload } from '@magickml/shared-services'

export type CorePluginEvents = {
  [EventTypes.ON_MESSAGE]: (payload: EventPayload) => void
}
