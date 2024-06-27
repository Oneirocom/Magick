import { NodeCategory } from '@magickml/behave-graph'
import { makeMagickEventNodeDefinition } from '@magickml/grimoire'
import { EventTypes } from '@magickml/agent-communication'
import { type CoreWebhookEventPayload, corePluginName } from '../../config'

type State = {
  onStartEvent?: ((event: CoreWebhookEventPayload) => void) | undefined
}

// Define the initial state function
const makeInitialState = (): State => ({
  onStartEvent: undefined,
})

// Define the specific event configuration for the message event
const webhookEventConfig = {
  handleEvent: (event: CoreWebhookEventPayload, args: any) => {
    const { write, commit } = args
    write('event', event)
    write('content', event.content)
    write('callback', event.channel)
    commit('flow')
  },
  dependencyName: corePluginName,
  eventName: EventTypes.ON_WEBHOOK,
}

// Utilize the new factory function to create the message event
export const webhookEventNode = makeMagickEventNodeDefinition(
  {
    typeName: 'magick/onWebhook',
    label: 'On Webhook',
    category: NodeCategory.Event,
    in: {},
    out: {
      flow: 'flow',
      content: 'string',
      callback: 'string',
      event: 'object',
    },
    initialState: makeInitialState(),
  },
  webhookEventConfig
)
