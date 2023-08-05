// DOCUMENTED
/**
 * A plugin for the @magickml/core that adds weather completion functionality
 *
 * @remarks
 * The plugin uses handlers for text, chat and text embedding which are defined in the 'makeTextCompletion',
 * 'makeChatCompletion' and 'makeTextEmbedding' functions respectively.
 *
 * @packageDocumentation
 */

import { ServerPlugin } from '@magickml/core'
import shared from '@magickml/plugin-weather-shared'
import { getCurrentWeather } from './functions/getCurrentWeather'
import { getCurrentForecast } from './functions/getCurrentForecast'


/**
 * The secrets used by the weather API
 */
const { secrets } = shared

/**
 * The handlers for each type of weather completion
 */
const completionHandlers = {
  weather: {
    current: getCurrentWeather,
    forecast: getCurrentForecast,
  },
}

/**
 * A server plugin for the @magickml/core that adds weather completion functionality
 */
const weatherPlugin = new ServerPlugin({
  name: 'weatherPlugin',
  secrets,
  completionProviders: shared.completionProviders.map(provider => {
    return {
      ...provider,
      handler: completionHandlers[provider.type][provider.subtype],
    }
  }),
})

export default weatherPlugin
