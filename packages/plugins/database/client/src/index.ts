// UNDOCUMENTED
/**
 * A plugin for interacting with database's API.
 * @class
 */
import { ClientPlugin, InputControl } from 'shared/core'
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
    tooltip: 'Enter table here',
  },
]

const insertControls = [
  {
    type: InputControl,
    dataKey: 'table',
    name: 'Table',
    icon: 'database',
    defaultValue: '',
    tooltip: 'Enter table here',
  },
]

const updateControls = [
  {
    type: InputControl,
    dataKey: 'table',
    name: 'Table',
    icon: 'database',
    defaultValue: '',
    tooltip: 'Enter table here',
  },
]

const upsertControls = [
  {
    type: InputControl,
    dataKey: 'table',
    name: 'Table',
    icon: 'database',
    defaultValue: '',
    tooltip: 'Enter table here',
  },
  {
    type: InputControl,
    dataKey: 'onConflict',
    name: 'On Conflict',
    icon: 'database',
    defaultValue: '',
    tooltip: 'Enter On conflict',
  },
]

const deleteControls = [
  {
    type: InputControl,
    dataKey: 'table',
    name: 'Table',
    icon: 'database',
    defaultValue: '',
    tooltip: 'Enter table here',
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
