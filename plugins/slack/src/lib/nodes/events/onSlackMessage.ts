import {
  SLACK_EVENTS,
  slackPluginName,
  type SlackEventPayload,
  type SlackEvents,
} from '../../configx'
import { makeMagickEventNodeDefinition } from 'server/grimoire'
import { NodeCategory } from '@magickml/behave-graph'

type State = {
  onStartEvent?: ((event: SlackEventPayload) => void) | undefined
}
const makeInitialState = (): State => ({
  onStartEvent: undefined,
})

const createMagickSlackEventNode = (
  typeName: string,
  label: string,
  eventKey: SlackEvents,
  out: Record<string, string>,
  handleEvent: (event: SlackEventPayload, args: any) => void
) => {
  const eventConfig = {
    handleEvent,
    dependencyName: slackPluginName,
    eventName: SLACK_EVENTS[eventKey],
  }

  return makeMagickEventNodeDefinition<SlackEventPayload>(
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

export const onSlackMessage = createMagickSlackEventNode(
  'slack/onMessage',
  'On Slack Message',
  'message',
  {
    flow: 'flow',
    content: 'string',
    sender: 'string',
    channel: 'string',
    context: 'object',
    event: 'object',
  },
  (event, { write, commit }) => {
    write('content', event.content)
    write('sender', event.sender)
    write('channel', event.channel)
    write('context', event.metadata['context'])
    commit('flow')
  }
)

export const onSlackMessageNodes = [onSlackMessage]
