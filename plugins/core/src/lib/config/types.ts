import { EventTypes } from 'communication'
import { EventPayload } from 'servicesShared'

export type CorePluginEvents = {
  [EventTypes.ON_MESSAGE]: (payload: EventPayload) => void
}
