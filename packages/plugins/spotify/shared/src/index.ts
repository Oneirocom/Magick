// DOCUMENTED
/**
 * This is the main file exporting the nodes used in the app
 */

import { MagickComponent, PluginSecret } from '@magickml/core'
import { SearchSpotify } from './nodes/SearchSpotify'
import { GetSpotifyPlaybackState } from './nodes/GetSpotifyPlaybackState'

export const secrets: PluginSecret[] = [
  {
    name: 'Spotify API Key',
    key: 'spotify_api_key',
    global: true,
    getUrl: 'https://developer.spotify.com/dashboard/applications',
  },
]

/**
 * Export an array of all nodes used in the app.
 * @returns MagickComponent[]
 */
export function getNodes(): MagickComponent<any>[] {
  return [SearchSpotify as any, GetSpotifyPlaybackState as any]
}
