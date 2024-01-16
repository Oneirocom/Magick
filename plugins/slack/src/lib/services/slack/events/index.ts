import * as events from './isEvent'
import { MessageEvent } from '@slack/bolt'

const typeGuardMap: { [key: string]: (event: MessageEvent) => boolean } = {
  GenericMessageEvent: events.isGenericMessageEvent,
  GenericIMMessageEvent: events.isGenericIMMessageEvent,
  GenericMPIMMessageEvent: events.isGenericMPIMMessageEvent,
  BotMessageEvent: events.isBotMessageEvent,
  ChannelJoinMessageEvent: events.isChannelJoinMessageEvent,
  ChannelLeaveMessageEvent: events.isChannelLeaveMessageEvent,
  FileShareMessageEvent: events.isFileShareMessageEvent,
  MeMessageEvent: events.isMeMessageEvent,
  MessageChangedEvent: events.isMessageChangedEvent,
  MessageDeletedEvent: events.isMessageDeletedEvent,
  MessageRepliedEvent: events.isMessageRepliedEvent,
}

export function identifyMessageType(event: MessageEvent): string | undefined {
  for (const [type, guard] of Object.entries(typeGuardMap)) {
    if (guard(event)) {
      return type
    }
  }

  return undefined
}
