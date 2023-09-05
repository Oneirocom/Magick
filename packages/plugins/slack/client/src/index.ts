import { ClientPlugin, eventSocket, triggerSocket } from '@magickml/core'
import SlackAgentWindow from './components/slack.component'
import slackSpellTemplate from './templates/spells/REST API.spell.json'

const inputSockets = [
  {
    socket: 'output',
    name: 'output',
    type: eventSocket,
  },
  {
    socket: 'trigger',
    name: 'trigger',
    type: triggerSocket,
  },
]

const outputSockets = [
  {
    socket: 'output',
    name: 'output',
    type: eventSocket,
  },
]

const slackPlugin = new ClientPlugin({
  name: 'slackPlugin',
  agentComponents: [SlackAgentWindow],
  spellTemplates: [slackSpellTemplate],
  inputTypes: [
    { name: 'Slack (Message)', sockets: inputSockets },
    { name: 'Slack (Mention)', sockets: inputSockets },
  ],
  outputTypes: [{ name: 'Slack (Response)', sockets: outputSockets }],
})

export default slackPlugin
