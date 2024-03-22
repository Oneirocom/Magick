import { createActionNode } from 'plugins/shared/src'
import { EventPayload } from 'server/plugin'
import {
  type DiscordEventPayload,
  DISCORD_DEPENDENCIES,
  type SendMessage,
} from '../../configx'
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

export const streamDiscordMessage = createActionNode<
  Inputs,
  Outputs,
  [
    typeof DISCORD_DEPENDENCIES.DISCORD_KEY,
    'IEventStore',
    typeof DISCORD_DEPENDENCIES.DISCORD_STREAM_MESSAGE
  ]
>({
  label: 'Stream Discord Message',
  typeName: 'discord/streamMessage',
  dependencyKeys: [
    DISCORD_DEPENDENCIES.DISCORD_KEY,
    'IEventStore',
    DISCORD_DEPENDENCIES.DISCORD_STREAM_MESSAGE,
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
      [DISCORD_DEPENDENCIES.DISCORD_KEY]: Client
      IEventStore: IEventStore
      [DISCORD_DEPENDENCIES.DISCORD_STREAM_MESSAGE]: (
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

      const streamDiscordMessage = dependencies[
        DISCORD_DEPENDENCIES.DISCORD_STREAM_MESSAGE
      ] as SendMessage | undefined

      if (!streamDiscordMessage) {
        throw new Error('Discord stream function not found')
      }

      await streamDiscordMessage<'messageCreate'>(inputs.content, event)
    } catch (e) {
      console.log(e)
    }

    commit('flow')
  },
})
