// UNDOCUMENTED
/**
 * A plugin for interacting with database's API.
 * @class
 */
import { ClientPlugin, InputControl } from '@magickml/core'
import shared from '@magickml/plugin-database-shared'

// Importing shared variables from plugin-database-shared module
const { secrets, completionProviders } = shared

// Input controls for database operations

const selectControls = [
  {
    type: InputControl,
    dataKey: 'table',
    name: 'Table',
    icon: 'database',
    defaultValue: '',
  },
]

const insertControls = [
  {
    type: InputControl,
    dataKey: 'table',
    name: 'Table',
    icon: 'database',
    defaultValue: '',
  },
]

const updateControls = [
  {
    type: InputControl,
    dataKey: 'table',
    name: 'Table',
    icon: 'database',
    defaultValue: '',
  },
]

const upsertControls = [
  {
    type: InputControl,
    dataKey: 'table',
    name: 'Table',
    icon: 'database',
    defaultValue: '',
  },
  {
    type: InputControl,
    dataKey: 'onConflict',
    name: 'On Conflict',
    icon: 'database',
    defaultValue: '',
  },
]

const deleteControls = [
  {
    type: InputControl,
    dataKey: 'table',
    name: 'Table',
    icon: 'database',
    defaultValue: '',
  },
]

// Object containing all input controls for different operation types
const inspectorControls = {
  select: selectControls,
  insert: insertControls,
  update: updateControls,
  upsert: upsertControls,
  delete: deleteControls,
}

// Creating a new databasePlugin instance
const databasePlugin = new ClientPlugin({
  name: 'databasePlugin',
  secrets, // URL and Key secrets
  completionProviders: completionProviders.map(provider => {
    // Adding custom input controls for each completion type
    return {
      ...provider,
      inspectorControls: inspectorControls[provider.subtype],
    }
  }),
})

export default databasePlugin
