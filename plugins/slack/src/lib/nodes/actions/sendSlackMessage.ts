import { NodeCategory, makeFlowNodeDefinition } from '@magickml/behave-graph'
import { IEventStore } from 'packages/server/grimoire/src'
import { SlackActionService } from '../../services/slackActionService'
import { WebClient, WebClientOptions } from '@slack/web-api'
import { EventPayload } from 'packages/server/plugin/src'
import { SlackEventPayload } from '../../types'
import { FEATURE_FLAGS } from 'packages/shared/config/src'

export const sendSlackMessage = makeFlowNodeDefinition({
  typeName: 'slack/sendMessage',
  category: NodeCategory.Action,
  label: 'Send Message',
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

    if (!slackActionService || !eventStore) {
      throw new Error('No slackActionService or eventStore provided')
    }

    const content = read('content') as string
    const event = eventStore.currentEvent() as EventPayload<SlackEventPayload>
    const channel = event.channel

    if (!event || !channel) {
      throw new Error('No event found')
    }

    const web = new WebClient(FEATURE_FLAGS.SLACK_AGENT_TOKEN, {
      retryConfig: {
        retries: 3,
      },
    } as WebClientOptions)

    try {
      await web.chat.postMessage({
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
