import { createActionNode } from 'plugins/shared/src'
import { DiscordClient } from '../../services/discord'
import { EventPayload } from 'server/plugin'
import { DiscordEventPayload } from '../../types'
import { SocketDefinition } from '@magickml/behave-graph'
import { DISCORD_KEY } from '../../constants'
import { IEventStore } from 'server/grimoire'

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
  [typeof DISCORD_KEY, 'IEventStore']
>({
  label: 'Send Discord Message',
  typeName: 'discord/sendMessage',
  dependencyKeys: [DISCORD_KEY, 'IEventStore'],
  inputs: {
    flow: { valueType: 'flow' },
    content: { valueType: 'string' },
    channel: { valueType: 'string' },
  },
  outputs: {
    flow: { valueType: 'flow' },
  },
  process: async (
    dependencies: { [DISCORD_KEY]: DiscordClient; IEventStore: IEventStore },
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

      const discordClient = await dependencies[DISCORD_KEY]

      if (!discordClient) {
        throw new Error(`Discord client not found.`)
      }

      await discordClient.sendMessage<'messageCreate'>(inputs.content, event)
    } catch (e) {
      console.log(e)
    }

    commit('flow')
  },
})
