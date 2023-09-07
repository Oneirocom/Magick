// UNDOCUMENTED
/**
 * A plugin for interacting with storage services.
 * @class
 */
import { ClientPlugin, InputControl } from '@magickml/core'
import shared from '@magickml/plugin-storage-shared'

// Importing shared variables from plugin-storage-shared module
const { secrets, completionProviders } = shared

// Array of input controls for the upload completion type
const uploadCompletionControls = [
  {
    type: InputControl,
    dataKey: 'bucketName',
    name: 'Bucket Name',
    icon: 'moon',
    defaultValue: '###',
  },
  {
    type: InputControl,
    dataKey: 'apiVersion',
    name: 'API Version',
    icon: 'moon',
    defaultValue: '2010-12-01',
  },
  {
    type: InputControl,
    dataKey: 'region',
    name: 'Region',
    icon: 'moon',
    defaultValue: 'us-east-1',
  },
  {
    type: InputControl,
    dataKey: 'fileExtension',
    name: 'File Extension',
    icon: 'moon',
    defaultValue: '.png',
  },
]

// Object containing all input controls for different completion types
const inspectorControls = {
  upload: uploadCompletionControls,
}

// Creating a new storagePlugin instance
const storagePlugin = new ClientPlugin({
  name: 'StoragePlugin',
  secrets,
  completionProviders: completionProviders.map(provider => {
    // Adding custom input controls for each completion type
    return {
      ...provider,
      inspectorControls: inspectorControls[provider.subtype],
    }
  }),
})

export default storagePlugin
