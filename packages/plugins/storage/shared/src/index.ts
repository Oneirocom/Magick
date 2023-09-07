// UNDOCUMENTED
import {
  arraySocket,
  CompletionProvider,
  fileSocket,
  PluginSecret,
  stringSocket,
} from '@magickml/core'

/**
 * An array of PluginSecret objects containing information about API key secrets.
 */
const secrets: PluginSecret[] = [
  {
    name: 'S3 Access Key',
    key: 's3_access_key',
    global: true,
    getUrl: 'https://aws.com',
  },
  {
    name: 'S3 Secret Key',
    key: 's3_secret_key',
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
        socket: 'fileName',
        name: 'File Name',
        type: stringSocket,
      },
      {
        socket: 'files',
        name: 'Base64 Files',
        type: arraySocket,
      },
    ],
    outputs: [
      {
        socket: 'urls',
        name: 'URLs',
        type: arraySocket,
      },
    ],
    models: ['AWS', 'Local'],
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
