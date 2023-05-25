// UNDOCUMENTED
import {
  arraySocket,
  CompletionProvider,
  objectSocket,
  PluginSecret,
  stringSocket,
} from '@magickml/core'

/**
 * An array of PluginSecret objects containing information about API key secrets.
 */
const secrets: PluginSecret[] = [
  {
    name: 'Supabase URL',
    key: 'supabase_url',
    global: true,
    getUrl: 'https://supabase.io/docs/guides/api#section-get-the-api-keys',
  },
  {
    name: 'Supabase Key',
    key: 'supabase_key',
    global: true,
    getUrl: 'https://supabase.io/docs/guides/api#section-get-the-api-keys',
  },
]
/**
 * An array of CompletionProvider objects containing information about supported completion providers.
 */
const completionProviders: CompletionProvider[] = [
  {
    type: 'database',
    subtype: 'select',
    inputs: [
      {
        socket: 'columns',
        name: 'Columns',
        type: arraySocket,
      },
      {
        socket: 'condition',
        name: 'Condition',
        type: stringSocket,
      },
      {
        socket: 'value',
        name: 'Value',
        type: stringSocket,
      },
    ],
    outputs: [
      {
        socket: 'result',
        name: 'Result',
        type: arraySocket,
      },
    ],
    models: ['supabase'],
  },
  {
    type: 'database',
    subtype: 'insert',
    inputs: [
      {
        socket: 'data',
        name: 'Data',
        type: objectSocket,
      },
    ],
    outputs: [
      {
        socket: 'result',
        name: 'Result',
        type: arraySocket,
      },
    ],
    models: ['supabase'],
  },
  {
    type: 'database',
    subtype: 'update',
    inputs: [
      {
        socket: 'data',
        name: 'Data',
        type: objectSocket,
      },
      {
        socket: 'condition',
        name: 'Condition',
        type: stringSocket,
      },
      {
        socket: 'value',
        name: 'Value',
        type: stringSocket,
      },
    ],
    outputs: [
      {
        socket: 'result',
        name: 'Result',
        type: arraySocket,
      },
    ],
    models: ['supabase'],
  },
  {
    type: 'database',
    subtype: 'upsert',
    inputs: [
      {
        socket: 'data',
        name: 'Data',
        type: objectSocket,
      },
    ],
    outputs: [
      {
        socket: 'result',
        name: 'Result',
        type: arraySocket,
      },
    ],
    models: ['supabase'],
  },
  {
    type: 'database',
    subtype: 'delete',
    inputs: [
      {
        socket: 'condition',
        name: 'Condition',
        type: stringSocket,
      },
      {
        socket: 'value',
        name: 'Value',
        type: stringSocket,
      },
    ],
    outputs: [
      {
        socket: 'result',
        name: 'Result',
        type: arraySocket,
      },
    ],
    models: ['supabase'],
  },
]

export default {
  secrets,
  completionProviders,
}
