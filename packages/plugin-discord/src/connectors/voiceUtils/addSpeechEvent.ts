import { Client } from 'discord.js'
import setupSpeechEvent from './speech'
import setupVoiceJoinEvent from './voiceJoin'
import { resolveSpeechWithGoogleSpeechV2 } from './googleV2'
import { SpeechOptions } from './speechOptions'

/**
 * Main function, use this to add new events to present [discord.Client](https://discord.js.org/#/docs/main/stable/class/Client)
 *
 * Defaults uses `en-US` language and google speech v2 api with generic key, that should be used for personal or testing purposes only, as it may be revoked by Google at any time.\
 * You can obtain your own API key here <http://www.chromium.org/developers/how-tos/api-keys>.\
 * See [python speech recognition package](https://github.com/Uberi/speech_recognition/blob/c89856088ad81d81d38be314e3db50905481c5fe/speech_recognition/__init__.py#L850) for more details.
 * <hr>
 *
 * Example usage:
 * ```javascript
 * const client = new Client({
 *   intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES],
 * });
 * addSpeechEvent(client, { lang: "pl-PL" });
 * ```
 */
export const addSpeechEvent = (client: Client, options?: SpeechOptions) => {
  const defaultOptions: SpeechOptions = {
    lang: 'en-US',
    speechRecognition: resolveSpeechWithGoogleSpeechV2,
    ignoreBots: true,
  }
  const speechOptions = { ...defaultOptions, ...options }

  setupVoiceJoinEvent(client, speechOptions)
  setupSpeechEvent(client, speechOptions)
}
