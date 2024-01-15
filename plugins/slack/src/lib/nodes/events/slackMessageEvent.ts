import {
  Assert,
  NodeCategory,
  makeEventNodeDefinition,
} from '@magickml/behave-graph'
import { SlackEmitterType } from '../../dependencies/slackEmitter'
import { SLACK_EVENTS } from '../../constants'
import { EventPayload } from 'packages/server/plugin/src'

type State = {
  onStartEvent?: ((event: EventPayload) => void) | undefined
}

const makeInitialState = (): State => ({
  onStartEvent: undefined,
})

export const slackMessageEvent = makeEventNodeDefinition({
  typeName: 'slack/onMessage',
  label: 'On Slack Message',
  category: NodeCategory.Event,
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

    const slackEventEmitter = getDependency<SlackEmitterType>('Slack')

    slackEventEmitter?.on('message', onStartEvent)

    return {
      onStartEvent,
    }
  },
  dispose: ({ state: { onStartEvent }, graph: { getDependency } }) => {
    Assert.mustBeTrue(onStartEvent !== undefined)

    const slackEventEmitter = getDependency<SlackEmitterType>('Slack')

    if (onStartEvent)
      slackEventEmitter?.removeListener(SLACK_EVENTS.message, onStartEvent)

    return {}
  },
})
