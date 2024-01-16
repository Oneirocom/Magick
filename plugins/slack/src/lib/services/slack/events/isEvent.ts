import { MessageEvent } from '@slack/bolt'
import { SLACK_EVENTS } from '../../../constants'

export function isGenericMessageEvent(event: MessageEvent) {
  return {
    match: event.type === 'message' && event.channel_type === 'channel',
    event: SLACK_EVENTS.message,
  }
}

export function isGenericIMMessageEvent(event: MessageEvent) {
  return {
    match: event.type === 'message' && event.channel_type === 'im',
    event: SLACK_EVENTS.message_im,
  }
}

export function isGenericMPIMMessageEvent(event: MessageEvent) {
  return {
    match: event.type === 'message' && event.channel_type === 'mpim',
    event: SLACK_EVENTS.message_mpim,
  }
}

export function isBotMessageEvent(event: MessageEvent) {
  return {
    match: event.subtype === 'bot_message',
    event: SLACK_EVENTS.bot_message,
  }
}

export function isChannelJoinMessageEvent(event: MessageEvent) {
  return {
    match: event.subtype === 'channel_join',
    event: SLACK_EVENTS.channel_join,
  }
}

export function isChannelLeaveMessageEvent(event: MessageEvent) {
  return {
    match: event.subtype === 'channel_leave',
    event: SLACK_EVENTS.channel_leave,
  }
}

export function isFileShareMessageEvent(event: MessageEvent) {
  return {
    match: event.subtype === 'file_share',
    event: SLACK_EVENTS.file_share,
  }
}

export function isMeMessageEvent(event: MessageEvent) {
  return {
    match: event.subtype === 'me_message',
    event: SLACK_EVENTS.me_message,
  }
}

export function isMessageChangedEvent(event: MessageEvent) {
  return {
    match: event.subtype === 'message_changed',
    event: SLACK_EVENTS.message_changed,
  }
}

export function isMessageDeletedEvent(event: MessageEvent) {
  return {
    match: event.subtype === 'message_deleted',
    event: SLACK_EVENTS.message_deleted,
  }
}

export function isMessageRepliedEvent(event: MessageEvent) {
  return {
    match: event.subtype === 'message_replied',
    event: SLACK_EVENTS.message_replied,
  }
}
