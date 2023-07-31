// UNDOCUMENTED
/**
 * A plugin for the @magickml/core that adds storage functionality
 *
 * @remarks
 * The plugin uses handlers for upload and download functionality with S3.
 *
 * @packageDocumentation
 */

import { ServerPlugin } from '@magickml/core'
import shared from '@magickml/plugin-storage-shared'
import {
  uploadFileToS3,
} from './functions'

/**
 * The secrets used by the Storage API
 */
const { secrets } = shared

/**
 * The handlers for each type of Upload and Download
 */
const completionHandlers = {
  storage: {
    upload: uploadFileToS3,
  },
}

/**
 * A server plugin for the @magickml/core that adds storage completion functionality
 */
const StoragePlugin = new ServerPlugin({
  name: 'StoragePlugin',
  secrets,
  completionProviders: shared.completionProviders.map(provider => {
    return {
      ...provider,
      handler: completionHandlers[provider.type][provider.subtype],
    }
  }),
})

export default StoragePlugin
