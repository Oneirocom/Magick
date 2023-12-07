import {
  Assert,
  NodeCategory,
  makeEventNodeDefinition,
} from '@magickml/behave-graph'
import { CoreEmitterType } from '../../dependencies/coreEmitter'
import { EventPayload, ON_MESSAGE } from 'server/plugin'

type State = {
  onStartEvent?: ((event: EventPayload) => void) | undefined
}

const makeInitialState = (): State => ({
  onStartEvent: undefined,
})

export const messageEvent = makeEventNodeDefinition({
  typeName: 'magick/onMessage',
  label: 'On Message',
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

      commit('flow')

      if (!node || !engine) return

      engine.onNodeExecutionEnd.emit(node)
    }

    const coreEventEmitter = getDependency<CoreEmitterType>('Core')

    coreEventEmitter?.on(ON_MESSAGE, onStartEvent)

    return {
      onStartEvent,
    }
  },
  dispose: ({ state: { onStartEvent }, graph: { getDependency } }) => {
    Assert.mustBeTrue(onStartEvent !== undefined)

    const coreEventEmitter = getDependency<CoreEmitterType>('Core')

    if (onStartEvent) coreEventEmitter?.removeListener(ON_MESSAGE, onStartEvent)

    return {}
  },
})
