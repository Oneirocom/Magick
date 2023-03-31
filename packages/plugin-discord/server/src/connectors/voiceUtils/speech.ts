// DOCUMENTED 
import {
  EndBehaviorType,
  entersState,
  VoiceConnection,
  VoiceConnectionStatus,
} from '@discordjs/voice'
import { Client } from 'discord.js'
import prism from 'prism-media'
import { SpeechOptions } from './speechOptions'
import createVoiceMessage from './createVoiceMessage'

/**
 * Handles `speaking` events on a VoiceConnection and emits `speech` events when someone stops speaking.
 * @param {Object} params - Params object
 * @param {Client} params.client - Discord.js Client instance
 * @param {VoiceConnection} params.connection - Voice connection to listen
 * @param {SpeechOptions} params.speechOptions - Speech options
 */
const handleSpeakingEvent = ({
  client,
  connection,
  speechOptions,
}: {
  client: Client
  connection: VoiceConnection
  speechOptions: SpeechOptions
}) => {
  connection.receiver.speaking.on(
    'start',
    function handleSpeechEventOnConnectionReceiver(userId) {
      // Ignore bots if ignoreBots option is true
      if (speechOptions.ignoreBots && client.users.cache.get(userId)?.bot) {
        return
      }

      const { receiver } = connection
      const opusStream: any = receiver.subscribe(userId, {
        end: {
          behavior: EndBehaviorType.AfterSilence,
          duration: 100,
        },
      })
      const bufferData: Uint8Array[] = []
      opusStream
        .pipe(
          new prism.opus.Decoder({ rate: 48000, channels: 2, frameSize: 960 })
        )
        .on('data', (data: Uint8Array) => {
          bufferData.push(data)
        })

      // When the stream ends, create a voice message and emit the `speech` event
      opusStream.on('end', async () => {
        const user = client.users.cache.get(userId)
        if (!user) return

        const voiceMessage = await createVoiceMessage({
          client,
          bufferData,
          user,
          connection,
          speechOptions,
        })
        if (voiceMessage) client.emit('speech', voiceMessage)
      })
    }
  )
}

/**
 * Enables `speech` event on a Discord.js Client instance, which is called whenever someone stops speaking
 * @param {Client} client - The Discord.js Client instance
 * @param {SpeechOptions} speechOptions - Speech options
 */
export default (client: Client, speechOptions: SpeechOptions): void => {
  client.on('voiceJoin', async (connection: VoiceConnection) => {
    // Wait for the voice connection to be ready
    await entersState(connection, VoiceConnectionStatus.Ready, 20e3)

    // Handle speaking events
    handleSpeakingEvent({ client, speechOptions, connection })
  })
}
