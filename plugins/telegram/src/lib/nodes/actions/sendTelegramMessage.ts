import { TelegramClient } from '../../services/telegram'
import { EventPayload } from 'packages/server/plugin/src'
import { TelegramEventPayload } from '../../types'
import { SocketDefinition } from '@magickml/behave-graph'
import { TELEGRAM_KEY } from '../../constants'
import { IEventStore } from 'server/grimoire'

type Inputs = {
  flow: SocketDefinition
  content: SocketDefinition
}

type Outputs = {
  flow: SocketDefinition
}

export const sendTelegramMessage = async (
  dependencies: { [TELEGRAM_KEY]: TelegramClient; IEventStore: IEventStore },
  inputs: { content: string },
  event: EventPayload<TelegramEventPayload>
): Promise<void> => {
  await dependencies[TELEGRAM_KEY].getClient().sendMessage({
    text: inputs.content,
    chat_id: event.chat.id,
  })
}
