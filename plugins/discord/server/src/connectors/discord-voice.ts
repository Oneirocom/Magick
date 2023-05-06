// DOCUMENTED
import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  StreamType,
  NoSubscriberBehavior,
} from '@discordjs/voice'
import { tts, tts_tiktalknet, app } from '@magickml/server-core'
import { addSpeechEvent } from './voiceUtils/addSpeechEvent'

/**
 * Remove emojis and custom emojis from a string.
 * @param {string} str - The string to remove emojis from.
 * @return {string} The string without emojis.
 */
function removeEmojisFromString(str: string): string {
  if (!str) return ''

  return str
    .replace(/(?: ... large regex ... )\uFE0F/g, '')
    .replace(/:(.*?):/g, '')
}

/**
 * Initialize the speech client and set up event listeners.
 * @param {Object} options - The options object.
 * @return {Object} Return discord client.
 */
export function initSpeechClient(options: {
  client: any
  agent: any
  spellRunner: any
  voiceProvider: string
  voiceCharacter: string
  languageCode: string
  tiktalknet_url: string
}) {
  const {
    client,
    agent,
    spellRunner,
    voiceProvider,
    voiceCharacter,
    languageCode,
    tiktalknet_url,
  } = options

  // Add speech event to the client.
  addSpeechEvent(client, { group: 'default_' + agent.id })

  const audioPlayer = createAudioPlayer({
    behaviors: {
      noSubscriber: NoSubscriberBehavior.Play,
    },
    debug: true,
  })

  client.on('speech', async msg => {
    const { content, connection, author, channel } = msg

    // Lazily import createReadStream.
    const createReadStream = await import('fs').then(fs => fs.createReadStream)

    connection.subscribe(audioPlayer)

    if (content) {
      const entities: any[] = []
      try {
        for (const [, member] of channel.members) {
          entities.push({
            user: member.user.username,
            inConversation: client.isInConversation(member.user.id),
            isBot: member.user.bot,
            info3d: '',
          })
        }
      } catch (e) {
        console.log('error getting members', e)
      }

      // Run spell and collect response.
      const fullResponse = await spellRunner.runComponent({
        inputs: {
          'Input - Discord (Voice)': {
            content,
            sender: author?.username ?? 'VoiceSpeaker',
            observer: agent.name,
            client: 'discord',
            channel: channel.id,
            agentId: agent.id,
            entities: entities.map((e: { user }) => e.user),
            channelType: 'voice',
            rawData: JSON.stringify(msg),
          },
        },
        secrets: agent.secrets ?? {},
        publicVariables: agent.publicVariables ?? {},
        app,
        runSubspell: true,
      })

      let response = Object.values(fullResponse)[0] as string
      if (!response) return

      // Remove emojis from response.
      response = removeEmojisFromString(response)

      let url
      if (response) {
        if (voiceProvider === 'google') {
          // Google TTS.
          url = await tts(response, voiceCharacter, languageCode)
        } else {
          url = await tts_tiktalknet(response, voiceCharacter, tiktalknet_url)
        }
        if (url) {
          const audioResource = createAudioResource(createReadStream(url), {
            inputType: StreamType.Arbitrary,
            inlineVolume: true,
          })
          audioPlayer.play(audioResource)
          audioPlayer.on(AudioPlayerStatus.Playing, () => {
            console.log('Now playing')
          })
          audioPlayer.on(AudioPlayerStatus.Idle, () => {
            console.log('Finished playing')
          })
        }
      }
    }
  })

  return client
}

export async function stopSpeechClient(textChannel, clientId) {
  let connection
  if (textChannel) {
    connection = joinVoiceChannel({
      channelId: textChannel.id,
      guildId: textChannel.guild.id,
      adapterCreator: textChannel.guild.voiceAdapterCreator,
      selfDeaf: false,
      group: 'default_' + clientId,
      selfMute: false, // this may also be needed
    })
  }
  connection.destroy()
}
/**
 * Join the voice channel and start listening to voice transcriptions.
 * @param {Discord.TextChannel} textChannel - Text channel to join.
 * @param {string} clientId - Client ID of the application.
 */
export async function recognizeSpeech(textChannel: any, clientId: string) {
  console.log('recognizeStream')
  let connection
  if (textChannel) {
    connection = joinVoiceChannel({
      channelId: textChannel.id,
      guildId: textChannel.guild.id,
      adapterCreator: textChannel.guild.voiceAdapterCreator,
      selfDeaf: false,
      group: 'default_' + clientId,
      selfMute: false, // this may also be needed
    })
  }
  return connection
}
