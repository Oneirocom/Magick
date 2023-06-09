// DOCUMENTED
import {
  anySocket,
  arraySocket,
  CompletionProvider,
  embeddingSocket,
  fileSocket,
  PluginSecret,
  stringSocket,
} from '@magickml/core'

/**
 * An array of PluginSecret objects containing information about API key secrets.
 */
const secrets: PluginSecret[] = [
  {
    name: 'S3 Access Key (AWS)',
    key: 'AWS_S3_ACCESS_KEY',
    global: true,
    getUrl: 'https://aws.com',
  },
  {
    name: 'S3 Secret Key (AWS)',
    key: 'AWS_S3_SECRET_KEY',
    global: true,
    getUrl: 'https://aws.com',
  },
]

/**
 * An array of CompletionProvider objects containing information about supported completion providers.
 */
const completionProviders: CompletionProvider[] = [
  {
    type: 'storage',
    subtype: 'upload',
    inputs: [
      {
        socket: 'files',
        name: 'Files',
        type: anySocket,
      },
    ],
    outputs: [
      {
        socket: 'url',
        name: 'URL',
        type: stringSocket,
      },
    ],
    models: [
      'AWS',
      'Local (Local Dev)',
    ],
  },
  {
    type: 'storage',
    subtype: 'download',
    inputs: [
      {
        socket: 'url',
        name: 'url',
        type: stringSocket,
      },
    ],
    outputs: [
      {
        socket: 'file',
        name: 'File',
        type: fileSocket,
      },
    ],
    models: ['AWS', 'Local (Local Dev)'],
  },
]

export default {
  secrets,
  completionProviders,
}
