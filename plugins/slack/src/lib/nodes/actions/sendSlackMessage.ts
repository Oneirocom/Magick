import { NodeCategory, makeFlowNodeDefinition } from '@magickml/behave-graph'
import { IEventStore } from 'packages/server/grimoire/src'
import { SlackActionService } from '../../services/slackActionService'
import { EventPayload } from 'packages/server/plugin/src'
import { SlackEventPayload } from '../../types'
import { SlackClient } from '../../services/slackClient'

export const sendSlackMessage = makeFlowNodeDefinition({
  typeName: 'slack/sendMessage',
  category: NodeCategory.Action,
  label: 'Send Slack Message',
  in: {
    flow: 'flow',
    content: 'string',
  },
  out: {
    flow: 'flow',
  },
  initialState: undefined,
  triggered: async ({ commit, read, graph: { getDependency } }) => {
    const slackActionService =
      getDependency<SlackActionService>('slackActionService')
    const eventStore = getDependency<IEventStore>('IEventStore')
    const slack = getDependency<SlackClient>('slackClient')

    if (!slackActionService || !eventStore || !slack) {
      throw new Error(
        `Missing required dependencies: ${[
          'slackActionService',
          'IEventStore',
          'slackClient',
        ]
          .filter(key => !getDependency(key))
          .join(', ')}`
      )
    }

    const content = read('content') as string
    const event = eventStore.currentEvent() as EventPayload<SlackEventPayload>
    const channel = event.channel

    if (!event || !channel) {
      throw new Error('No event found')
    }

    try {
      await slack.getClient().client.chat.postMessage({
        text: content,
        channel,
      })
    } catch (e) {
      console.log(e)
    }

    slackActionService?.sendMessage(event, { content })

    commit('flow')
  },
})
