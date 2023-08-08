// DOCUMENTED
import { CompletionHandlerInputData } from '@magickml/core'
import { createSpotifyClient } from './shared'
import { PlaybackState } from '@spotify/web-api-ts-sdk'
import { saveRequest } from '@magickml/core'

/**
 * Makes an API request to an AI text completion service.
 *
 * @param {CompletionHandlerInputData} data - The input data for the completion API.
 * @returns {Promise<{success: boolean, result?: string | null, error?: string | null}>} - A Promise resolving to the result of the completion API call.
 */
export async function spotifyGetPlaybackState(
  data: CompletionHandlerInputData
): Promise<{
  success: boolean
  playbackState?: PlaybackState
  error?: string | null
}> {
  // Destructure necessary properties from the data object.
  const { inputs, context, node } = data
  const { projectId, currentSpell } = context
  // Set the current spell for record keeping.
  const spell = currentSpell
  const query = inputs['query'][0] as string

  // get secret
  const apikey = context.module.secrets!['spotify_api_key']

  const client = createSpotifyClient('87c7acfba2484c7f9495aea41e629af5', apikey)

  try {
    const start = Date.now()
    const response = await client.player.getCurrentlyPlayingTrack()

    saveRequest({
      projectId: projectId,
      requestData: JSON.stringify(query),
      responseData: JSON.stringify(response),
      startTime: start,
      statusCode: response ? 200 : 500,
      status: response ? 'success' : 'error',
      model: 'spotify',
      parameters: JSON.stringify({}),
      type: 'search',
      provider: 'spotify',
      hidden: false,
      processed: false,
      spell,
      nodeId: node.id as number,
    })
    return {
      success: true,
      playbackState: response,
    }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}
