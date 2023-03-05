import { eventSocket, ServerPlugin } from '@magickml/engine'

function getAgentMethods() {

  return {
    start: () => { console.log('TODO')},
    stop: () => { console.log('TODO')},
  }
}

const TwitterPlugin = new ServerPlugin({
  name: 'TwitterPlugin',
  inputTypes: [
    { name: 'Twitter', trigger: true, socket: eventSocket },
  ],
  outputTypes: [
    { name: 'Twitter', trigger: false, socket: eventSocket },
  ],
  agentMethods: getAgentMethods(),
  secrets: []
})

export default TwitterPlugin
