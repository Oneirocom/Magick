import { createActionNode } from 'plugins/shared/src'
import { EventPayload } from 'server/plugin'
import {
  type DiscordEventPayload,
  DISCORD_DEP_KEYS,
  type SendMessage,
} from '../../config'
import { SocketDefinition } from '@magickml/behave-graph'
import { IEventStore } from 'server/grimoire'
import { Client } from 'discord.js'

type Inputs = {
  flow: SocketDefinition
  content: SocketDefinition
  channel: SocketDefinition
}

type Outputs = {
  flow: SocketDefinition
}

export const sendDiscordMessage = createActionNode<
  Inputs,
  Outputs,
  [
    typeof DISCORD_DEP_KEYS.DISCORD_KEY,
    'IEventStore',
    typeof DISCORD_DEP_KEYS.DISCORD_SEND_MESSAGE
  ]
>({
  label: 'Send Discord Message',
  typeName: 'discord/sendMessage',
  dependencyKeys: [
    DISCORD_DEP_KEYS.DISCORD_KEY,
    'IEventStore',
    DISCORD_DEP_KEYS.DISCORD_SEND_MESSAGE,
  ],
  inputs: {
    flow: { valueType: 'flow' },
    content: { valueType: 'string' },
    channel: { valueType: 'string' },
  },
  outputs: {
    flow: { valueType: 'flow' },
  },
  process: async (
    dependencies: {
      [DISCORD_DEP_KEYS.DISCORD_KEY]: Client
      IEventStore: IEventStore
      [DISCORD_DEP_KEYS.DISCORD_SEND_MESSAGE]: (
        content: string,
        event: EventPayload<DiscordEventPayload['messageCreate']>
      ) => void
    },
    inputs: { content: string },
    write: (key: keyof Outputs, value: any) => void,
    commit: (key: string) => void
  ) => {
    const event = dependencies.IEventStore.currentEvent() as EventPayload<
      DiscordEventPayload['messageCreate'],
      any
    > | null

    if (!event) {
      throw new Error('No event found')
    }

    try {
      if (!event.data.channelId) {
        throw new Error('No channel id found')
      }

      const sendDiscordMessage = dependencies[
        DISCORD_DEP_KEYS.DISCORD_SEND_MESSAGE
      ] as SendMessage | undefined

      if (!sendDiscordMessage) {
        throw new Error(`Discord client not found.`)
      }

      await sendDiscordMessage<'messageCreate'>(inputs.content, event)
    } catch (e) {
      console.log(e)
    }

    commit('flow')
  },
})
