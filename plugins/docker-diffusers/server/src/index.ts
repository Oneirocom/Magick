// DOCUMENTED
/**
 * A plugin for the @magickml/core that adds Docker Diffusers completion functionality
 *
 * @remarks
 * The plugin uses handlers for text, chat and text embedding which are defined in the 'makeTextCompletion',
 * 'makeChatCompletion' and 'makeTextEmbedding' functions respectively.
 *
 * @packageDocumentation
 */

import { ServerPlugin } from '@magickml/core'
import shared from '@magickml/plugin-docker-diffusers-shared'
import { makeImageCompletion } from './functions'

/**
 * The secrets used by the Docker Diffusers API
 */
const { secrets } = shared

/**
 * The handlers for each type of Docker Diffusers completion
 */
const completionHandlers = {
  image: {
    text2image: makeImageCompletion,
  },
}

/**
 * A server plugin for the @magickml/core that adds Docker Diffusers completion functionality
 */
const DockerDiffusersPlugin = new ServerPlugin({
  name: 'DockerDiffusersPlugin',
  secrets,
  completionProviders: shared.completionProviders.map(provider => {
    return {
      ...provider,
      handler: completionHandlers[provider.type][provider.subtype],
    }
  }),
})

export default DockerDiffusersPlugin
