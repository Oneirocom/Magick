import { DISCORD_EVENTS, discordPluginName } from '../../constants'
import { EventPayload } from 'server/plugin'
import { DiscordEventPayload } from '../../types'
import { makeMagickEventNodeDefinition } from 'server/grimoire'
import { NodeCategory } from '@magickml/behave-graph'

type State = {
  onStartEvent?: ((event: EventPayload) => void) | undefined
}

const makeInitialState = (): State => ({
  onStartEvent: undefined,
})

const createMagickDiscordEventNode = <
  K extends keyof DiscordEventPayload = keyof DiscordEventPayload
>(
  typeName: string,
  label: string,
  eventKey: K,
  out: Record<string, string>,
  handleEvent: (event: EventPayload<DiscordEventPayload[K]>, args: any) => void
) => {
  const eventConfig = {
    handleEvent,
    dependencyName: discordPluginName,
    eventName: DISCORD_EVENTS[eventKey],
  }

  return makeMagickEventNodeDefinition<EventPayload<DiscordEventPayload[K]>>(
    {
      typeName,
      label,
      category: NodeCategory.Event,
      in: {},
      out,
      initialState: makeInitialState(),
    },
    eventConfig
  )
}

export const onDiscordMessage = createMagickDiscordEventNode<'messageCreate'>(
  'discord/onMessage',
  'On Discord Message',
  'messageCreate',
  {
    flow: 'flow',
    content: 'string',
    sender: 'string',
    channel: 'string',
    event: 'object',
  },
  (event, { write, commit }) => {
    write('content', event.data.content)
    write('sender', event.data.author.username)
    write('channel', event.data.channelId)
    commit('flow')
  }
)

export const onDiscordReactionAdd =
  createMagickDiscordEventNode<'messageReactionAdd'>(
    'discord/onReactionAdd',
    'On Discord Reaction Add',
    'messageReactionAdd',
    {
      flow: 'flow',
      reaction: 'string',
      count: 'number',
      messageId: 'string',
      event: 'event',
    },
    (event, { write, commit }) => {
      write('reaction', event.data.emoji.name)
      write('count', event.data.count)
      write('messageId', event.data.messageId)
      write('event', event.data)
      commit('flow')
    }
  )

export const onDiscordMessageNodes = [onDiscordMessage, onDiscordReactionAdd]
