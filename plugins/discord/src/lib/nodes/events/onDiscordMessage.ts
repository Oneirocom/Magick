import {
  DISCORD_EVENTS,
  type DiscordEventMetadata,
  discordPluginName,
  type DiscordEventPayload,
} from '../../config'
import { EventPayload } from 'server/plugin'
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
  handleEvent: (
    event: EventPayload<DiscordEventPayload[K], DiscordEventMetadata>,
    args: any
  ) => void
) => {
  const eventConfig = {
    handleEvent,
    dependencyName: discordPluginName,
    eventName: DISCORD_EVENTS[eventKey],
  }

  return makeMagickEventNodeDefinition<
    EventPayload<DiscordEventPayload[K], DiscordEventMetadata>
  >(
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
    context: 'object',
    event: 'object',
  },
  (event, { write, commit }) => {
    write('content', event.data.content)
    write('sender', event.data.author.username)
    write('channel', event.data.channelId)
    write('context', event.metadata['context'])
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
      write('context', event.metadata['context'])
      commit('flow')
    }
  )

export const onDiscordMessageNodes = [onDiscordMessage, onDiscordReactionAdd]
