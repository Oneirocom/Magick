import { createActionNode } from '@magickml/shared-plugins'
import { type SlackEventPayload, SLACK_DEPENDENCIES } from '../../configx'
import { SocketDefinition } from '@magickml/behave-graph'
import { IEventStore } from '@magickml/agent-service'
import { EventPayload } from '@magickml/shared-services'
import { type App } from '@slack/bolt'

type Inputs = {
  flow: SocketDefinition
  images: SocketDefinition
  comment: SocketDefinition
}

type Outputs = {
  flow: SocketDefinition
}

const process = async (
  dependencies: {
    slackClient: App
    IEventStore: IEventStore
  },
  inputs: { images: string[]; comment: string },
  write: (key: keyof Outputs, value: any) => void,
  commit: (key: string) => void
) => {
  console.log('sending slack image')
  const event =
    dependencies.IEventStore.currentEvent() as EventPayload<SlackEventPayload>

  const blocks: any[] = []

  inputs.images.forEach(image => {
    blocks.push({
      type: 'image',
      title: {
        type: 'plain_text',
        text: inputs.comment ?? 'Sent from MagickML',
        emoji: true,
      },
      image_url: image,
      alt_text: inputs.comment ?? 'Sent from MagickML',
    })
  })

  // Send the message
  await dependencies.slackClient.client.chat.postMessage({
    channel: event.channel,
    blocks: blocks,
    text: inputs.comment ?? 'Sent from MagickML',
  })

  commit('flow') // Commit the flow after sending the message
}

export const sendSlackImage = createActionNode<
  Inputs,
  Outputs,
  [typeof SLACK_DEPENDENCIES.SLACK_CLIENT, 'IEventStore', 'slackActionService']
>({
  // eventName: SLACK_ACTIONS.sendImage,
  label: 'Send Slack Image',
  typeName: 'slack/sendImage',
  dependencyKeys: [
    SLACK_DEPENDENCIES.SLACK_CLIENT,
    'IEventStore',
    'slackActionService',
  ],
  inputs: {
    flow: { valueType: 'flow' },
    images: { valueType: 'string[]' },
    comment: { valueType: 'string' },
  },
  outputs: {
    flow: { valueType: 'flow' },
  },
  process,
})
