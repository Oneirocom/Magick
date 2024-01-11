import {
  GenericMessageEvent,
  BotMessageEvent,
  ChannelJoinMessageEvent,
  ChannelLeaveMessageEvent,
  FileShareMessageEvent,
  MeMessageEvent,
  MessageChangedEvent,
  MessageDeletedEvent,
  MessageRepliedEvent,
  MessageEvent,
} from '@slack/bolt'

export function isGenericMessageEvent(
  event: MessageEvent
): event is GenericMessageEvent {
  return event.type === 'message' && event.subtype === undefined
}

export function isBotMessageEvent(
  event: MessageEvent
): event is BotMessageEvent {
  return event.subtype === 'bot_message'
}

export function isChannelJoinMessageEvent(
  event: MessageEvent
): event is ChannelJoinMessageEvent {
  return event.subtype === 'channel_join'
}

export function isChannelLeaveMessageEvent(
  event: MessageEvent
): event is ChannelLeaveMessageEvent {
  return event.subtype === 'channel_leave'
}

export function isFileShareMessageEvent(
  event: MessageEvent
): event is FileShareMessageEvent {
  return event.subtype === 'file_share'
}

export function isMeMessageEvent(event: MessageEvent): event is MeMessageEvent {
  return event.subtype === 'me_message'
}

export function isMessageChangedEvent(
  event: MessageEvent
): event is MessageChangedEvent {
  return event.subtype === 'message_changed'
}

export function isMessageDeletedEvent(
  event: MessageEvent
): event is MessageDeletedEvent {
  return event.subtype === 'message_deleted'
}

export function isMessageRepliedEvent(
  event: MessageEvent
): event is MessageRepliedEvent {
  return event.subtype === 'message_replied'
}
