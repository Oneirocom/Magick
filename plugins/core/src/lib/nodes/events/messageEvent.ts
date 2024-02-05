import { NodeCategory } from '@magickml/behave-graph'
import { EventPayload } from 'server/plugin'
import { makeMagickEventNodeDefinition } from 'server/grimoire'
import { EventTypes } from 'communication'
import { corePluginName } from '../../constants'

type State = {
  onStartEvent?: ((event: EventPayload) => void) | undefined
}

// Define the initial state function
const makeInitialState = (): State => ({
  onStartEvent: undefined,
})

// Define the specific event configuration for the message event
const messageEventConfig = {
  handleEvent: (event: EventPayload, args: any) => {
    const { write, commit } = args
    write('event', event)
    write('content', event.content)
    commit('flow')
  },
  dependencyName: corePluginName, // specify the dependency name for the Core Event Emitter
  eventName: EventTypes.ON_MESSAGE, // specify the event name to listen to
}

// Utilize the new factory function to create the message event
export const messageEvent = makeMagickEventNodeDefinition(
  {
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
  },
  messageEventConfig
)
