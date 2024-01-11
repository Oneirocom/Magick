import { NodeCategory, makeFlowNodeDefinition } from '@magickml/behave-graph'
import { IEventStore } from 'server/grimoire'
import { SlackClient } from '../../services/slack'
import { EventPayload } from 'server/plugin'
import { SlackEventPayload } from '../../types'

export const sendSlackMessageV2 = makeFlowNodeDefinition({
  typeName: 'slack/sendImageV2',
  category: NodeCategory.Action,
  label: 'Send Message',
  in: {
    flow: 'flow',
    images: 'string[]',
    comment: 'string',
  },
  out: {
    flow: 'flow',
  },
  initialState: undefined,
  triggered: async ({ commit, read, graph: { getDependency } }) => {
    const slack = getDependency<SlackClient>('slackClient')
    const eventStore = getDependency<IEventStore>('IEventStore')

    if (!slack || !eventStore) {
      throw new Error('No slack client or event store found')
    }

    const inputs = {
      images: read('images') as string[],
      comment: read('comment') as string,
    }

    const event = eventStore.currentEvent() as EventPayload<SlackEventPayload>

    if (!event) {
      throw new Error('No event found')
    }

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
    await slack.getClient().client.chat.postMessage({
      channel: event.channel,
      blocks: blocks,
      text: inputs.comment ?? 'Sent from MagickML',
    })

    commit('flow')
  },
})
