import { DISCORD_EVENTS, discordPluginName } from '../../constants'
import { EventPayload } from 'server/plugin'
import { DiscordEmitterType } from '../../dependencies/discordEmitter'
import { createEventNode } from 'plugins/shared/src'
import { DiscordEventPayload } from '../../types'

type DiscordEventProcess<K extends keyof DiscordEventPayload> = (
  write: (key: string, value: any) => void,
  commit: (key: string) => void,
  event: EventPayload<DiscordEventPayload[K]>
) => void

const createDiscordEventNode = <
  K extends keyof DiscordEventPayload = keyof DiscordEventPayload
>(
  typeName: string,
  label: string,
  eventKey: K,
  out: Record<string, string>,
  process: DiscordEventProcess<K>
) =>
  createEventNode<DiscordEmitterType, DiscordEventPayload[K]>({
    base: {
      typeName,
      label,
      in: {},
      out,
    },
    emitterDependencyKey: discordPluginName,
    process: process,
    event: DISCORD_EVENTS[eventKey],
  })

export const onDiscordMessage = createDiscordEventNode<'messageCreate'>(
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
  (write, commit, event) => {
    write('content', event.data.content)
    write('sender', event.data.author.username)
    write('channel', event.data.channelId)
    commit('flow')
  }
)

export const onDiscordReactionAdd =
  createDiscordEventNode<'messageReactionAdd'>(
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
    (write, commit, event) => {
      write('reaction', event.data.emoji.name)
      write('count', event.data.count)
      write('messageId', event.data.messageId)
      write('event', event.data)
      commit('flow')
    }
  )

export const onDiscordMessageNodes = [onDiscordMessage, onDiscordReactionAdd]
