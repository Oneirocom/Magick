import {
  Assert,
  NodeCategory,
  makeEventNodeDefinition,
} from '@magickml/behave-graph'
import { CoreEmitter } from '../../dependencies/coreEmitter'
import { EventPayload, ON_MESSAGE } from 'server/plugin'
import { createEventName } from 'shared/utils'

type State = {
  onStartEvent?: ((event: EventPayload) => void) | undefined
}

const makeInitialState = (): State => ({
  onStartEvent: undefined,
})

export const MessageEvent = makeEventNodeDefinition({
  typeName: 'magick/onMessage',
  label: 'On Message',
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
      state,
      write,
      commit,
      node,
      engine,
      graph: { getDependency },
    } = args
    const onStartEvent = (event: EventPayload) => {
      write('event', event)
      write('content', event.content)
      commit('flow')

      if (!node || !engine) return

      engine.onNodeExecutionEnd.emit(node)
    }

    const coreEventEmitter = getDependency<CoreEmitter>('Core')

    const event = createEventName(engine!.id, ON_MESSAGE)
    coreEventEmitter?.on(event, onStartEvent)

    return {
      onStartEvent,
    }
  },
  dispose: ({ state: { onStartEvent }, graph: { getDependency } }) => {
    Assert.mustBeTrue(onStartEvent !== undefined)

    const coreEventEmitter = getDependency<CoreEmitter>('Core')

    if (onStartEvent) coreEventEmitter?.removeListener(ON_MESSAGE, onStartEvent)

    return {}
  },
})
