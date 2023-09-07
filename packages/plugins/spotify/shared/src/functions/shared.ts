import { SpotifyApi } from '@spotify/web-api-ts-sdk'

export const createSpotifyClient = (clientId: string, secret: string) => {
  return SpotifyApi.withClientCredentials(clientId, secret)
}
