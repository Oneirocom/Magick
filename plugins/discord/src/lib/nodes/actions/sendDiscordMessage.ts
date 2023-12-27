import { NodeCategory, makeFlowNodeDefinition } from '@magickml/behave-graph'
import { IEventStore } from 'packages/server/grimoire/src'
import { DiscordActionService } from '../../services/discordActionService'
import { EventPayload } from 'packages/server/plugin/src'
import { DiscordEventPayload } from '../../types'
import { DiscordClient } from '../../services/discordClient'
import { ChannelType, TextChannel } from 'discord.js'

export const sendDiscordMessage = makeFlowNodeDefinition({
  typeName: 'discord/sendMessage',
  category: NodeCategory.Action,
  label: 'Send Discord Message',
  in: {
    flow: 'flow',
    content: 'string',
  },
  out: {
    flow: 'flow',
  },
  initialState: undefined,
  triggered: async ({ commit, read, graph: { getDependency } }) => {
    console.log('sendDiscordMessage triggered')
    const discordActionService = getDependency<DiscordActionService>(
      'discordActionService'
    )
    const eventStore = getDependency<IEventStore>('IEventStore')
    const discord = getDependency<DiscordClient>('discordClient')

    if (!discordActionService || !eventStore || !discord) {
      throw new Error(
        `Missing required dependencies: ${[
          'discordActionService',
          'IEventStore',
          'discordClient',
        ]
          .filter(key => !getDependency(key))
          .join(', ')}`
      )
    }

    const content = read('content') as string
    console.log('sendDiscordMessage content', content)
    const event = eventStore.currentEvent() as EventPayload<DiscordEventPayload>
    console.log('sendDiscordMessage event', event)
    const channel = event.channel
    console.log('sendDiscordMessage channel', channel)

    if (!event || !channel) {
      throw new Error('No event found')
    }

    try {
      const channelObj = await discord.getClient().channels.fetch(channel)

      if (channelObj && channelObj.type === ChannelType.GuildText) {
        await (channelObj as TextChannel).send(content)
      } else {
        throw new Error('Channel is not a text channel')
      }
    } catch (e) {
      console.log(e)
    }

    discordActionService?.sendMessage(event, { content })

    commit('flow')
  },
})
