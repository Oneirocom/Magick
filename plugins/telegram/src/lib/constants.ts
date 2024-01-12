import { PluginCredential } from 'server/credentials'

export const pluginName = 'Telegram'

export const pluginCredentials: PluginCredential[] = [
  {
    name: 'telegram-bot',
    serviceType: 'telegram',
    credentialType: 'plugin',
    initials: 'TBT',
  },
]

export const TELEGRAM_EVENTS = {
  MESSAGE: 'message',
  EDITED_MESSAGE: 'edited_message',
  CHANNEL_POST: 'channel_post',
  EDITED_CHANNEL_POST: 'edited_channel_post',
  INLINE_QUERY: 'inline_query',
  CHOSEN_INLINE_RESULT: 'chosen_inline_result',
  CALLBACK_QUERY: 'callback_query',
  SHIPPING_QUERY: 'shipping_query',
  PRE_CHECKOUT_QUERY: 'pre_checkout_query',
  POLL: 'poll',
  POLL_ANSWER: 'poll_answer',
}

export const TELEGRAM_ACTIONS = {
  SEND_MESSAGE: 'sendMessage',
  SEND_IMAGE: 'sendImage',
  GENERATE_IMAGE: 'generateImage',
}

export const TELEGRAM_KEY = 'telegramClient'

export const TELEGRAM_DEVELOPER_MODE = false
