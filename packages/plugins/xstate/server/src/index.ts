
import {
    ServerPlugin,
    triggerSocket,
    eventSocket,
  } from '@magickml/core'
import { getNodes } from '@magickml/plugin-xstate-shared'

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

/**
 * A ServerPlugin that adds XState.
 */

const XStatePlugin = new ServerPlugin({
    name: 'XStatePlugin',
    nodes: getNodes(),
    inputTypes: [
      {
        name: 'XState (State)',
        sockets: inputSockets,
        defaultResponseOutput: 'XState (State Transition)',
      },
      {
        name: 'XState (Event)',
        sockets: inputSockets,
        defaultResponseOutput: 'XState (Event Response)',
      },
      {
        name: 'XState (Context)',
        sockets: inputSockets,
        defaultResponseOutput: 'XState (Context Update)',
      },
    ],
    outputTypes: [
      {
        name: 'XState (State Transition)',
        sockets: outputSockets,
        handler: async ({ output, agent, event }) => {
          await agent.xstate.handleMessage(event, output, 'state')
        },
      },
      {
        name: 'XState (Event Response)',
        sockets: outputSockets,
        handler: async ({ output, agent, event }) => {
          await agent.xstate.handleMessage(event, output, 'event')
        },
      },
      {
        name: 'XState (Context Update)',
        sockets: outputSockets,
        handler: async ({ output, agent, event }) => {
          await agent.xstate.handleMessage(event, output, 'context')
        },
      },
    ],
    secrets: [
    ],
  });
  

export default XStatePlugin;