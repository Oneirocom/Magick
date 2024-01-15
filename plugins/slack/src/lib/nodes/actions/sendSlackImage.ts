import { createAction } from 'plugins/shared/src'
import { SlackClient } from '../../services/slack'
import { EventPayload } from 'packages/server/plugin/src'
import { SlackEventPayload } from '../../types'
import { SocketDefinition } from '@magickml/behave-graph'
import { SLACK_KEY } from '../../constants'
import { IEventStore } from 'server/grimoire'

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
    slackClient: SlackClient
    IEventStore: IEventStore
  },
  inputs: { images: string[]; comment: string },
  write: (key: keyof Outputs, value: any) => void,
  commit: (key: string) => void
) => {
  console.log('sending slack image')
  const event =
    dependencies.IEventStore.currentEvent() as EventPayload<SlackEventPayload>

  let blocks: any[] = []

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
  await dependencies.slackClient.getClient().client.chat.postMessage({
    channel: event.channel,
    blocks: blocks,
    text: inputs.comment ?? 'Sent from MagickML',
  })

  commit('flow') // Commit the flow after sending the message
}

export const sendSlackImage = createAction<
  Inputs,
  Outputs,
  [typeof SLACK_KEY, 'IEventStore', 'slackActionService']
>({
  // eventName: SLACK_ACTIONS.sendImage,
  label: 'Send Slack Image',
  typeName: 'slack/sendImage',
  dependencyKeys: [SLACK_KEY, 'IEventStore', 'slackActionService'],
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
