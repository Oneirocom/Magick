import {
    Assert,
    NodeCategory,
    makeEventNodeDefinition,
  } from '@magickml/behave-graph'
  import { TELEGRAM_EVENTS } from '../../constants'
  import { EventPayload } from 'packages/server/plugin/src'
  
  type State = {
    onStartEvent?: ((event: EventPayload) => void) | undefined
  }
  
  const makeInitialState = (): State => ({
    onStartEvent: undefined,
  })
  
  export const telegramMessageEvent = makeEventNodeDefinition({
    typeName: 'telegram/onMessage',
    label: 'On Telegram Message',
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
  
      const telegramEventEmitter = getDependency('Telegram')
  
      telegramEventEmitter?.on('message', onStartEvent)
  
      return {
        onStartEvent,
      }
    },
    dispose: ({ state: { onStartEvent }, graph: { getDependency } }) => {
      Assert.mustBeTrue(onStartEvent !== undefined)
  
      const telegramEventEmitter = getDependency('Telegram')
  
      if (onStartEvent)
        telegramEventEmitter?.removeListener(
          TELEGRAM_EVENTS.message,
          onStartEvent
        )
  
      return {}
    },
  })
  