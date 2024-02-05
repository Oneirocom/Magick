import {
  Assert,
  NodeCategory,
  makeEventNodeDefinition,
} from '@magickml/behave-graph'
import { CoreEmitter } from '../../dependencies/coreEmitter'
import { EventPayload } from 'server/plugin'
import { corePluginName } from 'plugin/core'

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
  init: ({ state, write, commit, graph: { getDependency } }) => {
    Assert.mustBeTrue(state.onStartEvent === undefined)
    const onStartEvent = (event: EventPayload) => {
      write('event', event)
      write('content', event.content)
      commit('flow')
    }

    const coreEventEmitter = getDependency<CoreEmitter>(corePluginName)

    coreEventEmitter?.on('message', onStartEvent)

    return {
      onStartEvent,
    }
  },
  dispose: ({ state: { onStartEvent }, graph: { getDependency } }) => {
    Assert.mustBeTrue(onStartEvent !== undefined)

    const coreEventEmitter = getDependency<CoreEmitter>(corePluginName)

    if (onStartEvent) coreEventEmitter?.removeListener('message', onStartEvent)

    return {}
  },
})
