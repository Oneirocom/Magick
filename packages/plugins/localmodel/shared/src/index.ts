// DOCUMENTED
import {
  arraySocket,
  CompletionProvider,
  embeddingSocket,
  PluginSecret,
  stringSocket,
} from 'shared/core'

/**
 * An array of PluginSecret objects containing information about API key secrets.
 */
const secrets: PluginSecret[] = []

/**
 * An array of CompletionProvider objects containing information about supported completion providers.
 */
const completionProviders: CompletionProvider[] = [
  {
    type: 'text',
    subtype: 'text',
    inputs: [
      {
        socket: 'input',
        name: 'Input',
        type: stringSocket,
      },
    ],
    outputs: [
      {
        socket: 'result',
        name: 'Result',
        type: stringSocket,
      },
    ],
    models: ['Loaded Text Completion Model'],
  },
  {
    type: 'text',
    subtype: 'embedding',
    inputs: [
      {
        socket: 'input',
        name: 'Input',
        type: stringSocket,
      },
    ],
    outputs: [
      {
        socket: 'embedding',
        name: 'Embedding',
        type: embeddingSocket,
      },
    ],
    models: ['all-mpnet-base-v2'],
  },
  {
    type: 'text',
    subtype: 'chat',
    inputs: [
      {
        socket: 'system',
        name: 'System Directive',
        type: stringSocket,
      },
      {
        socket: 'conversation',
        name: 'Conversation ',
        type: arraySocket,
      },
      {
        socket: 'input',
        name: 'Input',
        type: stringSocket,
      },
    ],
    outputs: [
      {
        socket: 'result',
        name: 'Result',
        type: stringSocket,
      },
      {
        socket: 'error',
        name: 'Error',
        type: stringSocket,
      },
    ],
    models: ['Loaded Chat Completion Model'],
  },
]

export default {
  secrets,
  completionProviders,
}
