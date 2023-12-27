import {
  Assert,
  NodeCategory,
  makeEventNodeDefinition,
} from '@magickml/behave-graph'
import { DiscordEmitterType } from '../../dependencies/discordEmitter'
import { DISCORD_MESSAGES } from '../../constants'
import { EventPayload } from 'packages/server/plugin/src'

type State = {
  onStartEvent?: ((event: EventPayload) => void) | undefined
}

const makeInitialState = (): State => ({
  onStartEvent: undefined,
})

export const discordMessageEvent = makeEventNodeDefinition({
  typeName: 'discord/onMessage',
  label: 'On Discord Message',
  category: NodeCategory.Event,
  configuration: {
    numInputs: {
      valueType: 'number',
      defaultValue: 3,
    },
  },
  in: {},
  out: {
    flow: 'flow',
    content: 'string',
    event: 'object',
  },
  initialState: makeInitialState(),
  init: args => {
    const {
      write,
      commit,
      node,
      engine,
      graph: { getDependency },
    } = args
    const onStartEvent = (event: EventPayload) => {
      write('event', event)
      write('content', event.content)

      console.log('event', event)
      console.log('content', event.content)

      commit('flow')

      if (!node || !engine) return

      engine.onNodeExecutionEnd.emit(node)
    }

    const discordEventEmitter = getDependency<DiscordEmitterType>('Discord')

    discordEventEmitter?.on(DISCORD_MESSAGES.messageCreate, onStartEvent)

    return {
      onStartEvent,
    }
  },
  dispose: ({ state: { onStartEvent }, graph: { getDependency } }) => {
    Assert.mustBeTrue(onStartEvent !== undefined)

    const discordEventEmitter = getDependency<DiscordEmitterType>('Discord')

    if (onStartEvent)
      discordEventEmitter?.removeListener(
        DISCORD_MESSAGES.messageCreate,
        onStartEvent
      )

    return {}
  },
})
