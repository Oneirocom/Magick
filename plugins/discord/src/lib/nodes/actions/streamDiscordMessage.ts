import { createActionNode } from 'plugins/shared/src'
import { EventPayload } from 'server/plugin'
import {
  type DiscordEventPayload,
  DISCORD_DEPENDENCIES,
  type SendMessage,
} from '../../configx'
import { SocketDefinition } from '@magickml/behave-graph'
import { IEventStore } from 'server/grimoire'
import {
  Client,
  TextChannel,
  ThreadChannel,
  EmbedBuilder,
  ColorResolvable,
} from 'discord.js'

type Inputs = {
  flow: SocketDefinition
  content: SocketDefinition
  channelId: SocketDefinition
}

type Outputs = {
  flow: SocketDefinition
}

const EMBED_COLOR: Record<string, ColorResolvable> = {
  incomplete: 0xffa500, // Orange
  complete: 0x00ff00, // Green
}

const EMBED_MAX_LENGTH = 4096
const EDITS_PER_SECOND = 1.3

export const streamDiscordMessage = createActionNode<
  Inputs,
  Outputs,
  [
    typeof DISCORD_DEPENDENCIES.DISCORD_KEY,
    'IEventStore',
    typeof DISCORD_DEPENDENCIES.DISCORD_SEND_MESSAGE
  ]
>({
  label: 'Stream Discord Message',
  typeName: 'discord/streamMessage',
  dependencyKeys: [
    DISCORD_DEPENDENCIES.DISCORD_KEY,
    'IEventStore',
    DISCORD_DEPENDENCIES.DISCORD_SEND_MESSAGE,
  ],
  inputs: {
    flow: { valueType: 'flow' },
    content: { valueType: 'string' },
    channelId: { valueType: 'string' },
  },
  outputs: {
    flow: { valueType: 'flow' },
  },
  process: async (
    dependencies: {
      [DISCORD_DEPENDENCIES.DISCORD_KEY]: Client
      IEventStore: IEventStore
      [DISCORD_DEPENDENCIES.DISCORD_SEND_MESSAGE]: SendMessage
    },
    inputs: { content: string; channelId: string },
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
      const discordClient = dependencies[DISCORD_DEPENDENCIES.DISCORD_KEY] as Client
      const channel = (await discordClient.channels.fetch(
        inputs?.channelId ? inputs.channelId : event.channel
      )) as TextChannel | ThreadChannel

      if (!channel) {
        throw new Error('Channel not found')
      }

      let responseMessage = await channel.send({
        embeds: [
          new EmbedBuilder()
            .setDescription('⏳')
            .setColor(EMBED_COLOR.incomplete),
        ],
      })

      let responseContent = ''
      let lastTaskTime = Date.now()

      for await (const chunk of inputs.content.split(/(?<=\S)\s+/g)) {
        responseContent += chunk

        const isFinalEdit = responseContent.length >= inputs.content.length
        const shouldEdit =
          isFinalEdit || Date.now() - lastTaskTime >= 1000 / EDITS_PER_SECOND

        if (shouldEdit) {
          const embed = new EmbedBuilder()
            .setDescription(responseContent.slice(0, EMBED_MAX_LENGTH))
            .setColor(
              isFinalEdit ? EMBED_COLOR.complete : EMBED_COLOR.incomplete
            )

          await responseMessage.edit({ embeds: [embed] })
          lastTaskTime = Date.now()

          if (responseContent.length > EMBED_MAX_LENGTH) {
            responseContent = responseContent.slice(EMBED_MAX_LENGTH)
            responseMessage = await channel.send({
              embeds: [
                new EmbedBuilder()
                  .setDescription(responseContent.slice(0, EMBED_MAX_LENGTH))
                  .setColor(EMBED_COLOR.incomplete),
              ],
            })
          }
        }
      }

      // Send the final message if there's any remaining content
      if (responseContent.length > 0) {
        const embed = new EmbedBuilder()
          .setDescription(responseContent)
          .setColor(EMBED_COLOR.complete)

        await channel.send({ embeds: [embed] })
      }
    } catch (error) {
      console.error('Error while streaming Discord message:', error)
    }

    commit('flow')
  },
})