// UNDOCUMENTED
import {
  arraySocket,
  CompletionProvider,
  objectSocket,
  PluginSecret,
  stringSocket,
} from 'shared/core'

/**
 * An array of PluginSecret objects containing information about API key secrets.
 */
const secrets: PluginSecret[] = [
  {
    name: 'Postgres Connection String',
    key: 'pg_string',
    global: true,
    getUrl:
      'https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING',
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
    models: ['database'],
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
    models: ['database'],
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
    models: ['database'],
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
    models: ['database'],
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
    models: ['database'],
  },
]

export default {
  secrets,
  completionProviders,
}
