// DOCUMENTED
/**
 * A plugin for the @magickml/core that adds OpenAI completion functionality
 *
 * @remarks
 * The plugin uses handlers for text, chat and text embedding which are defined in the 'makeTextCompletion',
 * 'makeChatCompletion' and 'makeTextEmbedding' functions respectively.
 *
 * @packageDocumentation
 */

import { ServerPlugin } from 'shared/core'
import shared from '@magickml/plugin-database-shared'
import { select, deleteRow, insert, update, upsert } from './functions'

/**
 * The secrets used by the OpenAI API
 */
const { secrets } = shared

/**
 * The handlers for each type of OpenAI completion
 */
const completionHandlers = {
  database: {
    select: select,
    delete: deleteRow,
    insert: insert,
    update: update,
    upsert: upsert,
  },
}

/**
 * A server plugin for the @magickml/core that adds OpenAI completion functionality
 */
const databasePlugin = new ServerPlugin({
  name: 'databasePlugin',
  secrets,
  completionProviders: shared.completionProviders.map(provider => {
    return {
      ...provider,
      handler: completionHandlers[provider.type][provider.subtype],
    }
  }),
})

export default databasePlugin
