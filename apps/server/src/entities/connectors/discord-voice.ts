// @ts-nocheck
import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  StreamType,
  VoiceConnectionStatus,
} from '@discordjs/voice'
import { tts } from '../../systems/googleTextToSpeech'
import { getAudioUrl } from '../../routes/getAudioUrl'
import { addSpeechEvent } from './voiceUtils/addSpeechEvent'
import { removeEmojisFromString } from '../../utils/utils'
import { cacheManager } from '../../cacheManager'
import { tts_tiktalknet } from '../../systems/tiktalknet'

//const transcriber = new Transcriber('288916776772018')
export function initSpeechClient(
  client,
  discord_bot_name,
  entity,
  handleInput,
  voiceProvider,
  voiceCharacter,
  languageCode,
  tiktalknet_url
) {
  addSpeechEvent(client, { group: 'default_' + entity.id })

  client.on('speech', async msg => {
    console.log('msg is ', msg)
    const content = msg.content
    const connection = msg.connection
    const author = msg.author
    const channel = msg.channel

    console.log('got voice input:', content)
    if (content) {
      const roomInfo: {
        user: string
        inConversation: boolean
        isBot: boolean
        info3d: string
      }[] = []

      try {
        for (const [memberID, member] of channel.members) {
          roomInfo.push({
            user: member.user.username,
            inConversation: this.isInConversation(member.user.id),
            isBot: member.user.bot,
            info3d: '',
          })
        }
      } catch (e) { }

      console.log(roomInfo)
      const response = removeEmojisFromString(
        await handleInput(
          content,
          author?.username ?? 'VoiceSpeaker',
          discord_bot_name,
          'discord',
          channel.id,
          entity,
          roomInfo,
          'voice'
        )
      )
      if (response === undefined || !response || response.length <= 0) {
        return
      }

      console.log('response is', response)
      if (response) {
        const audioPlayer = createAudioPlayer()

        // TODO
        // 1. get the voice provider
        // if google, use that
        // otherwise use uberduck
        // 2. set the character name from the request
        let url = await cacheManager.instance.get(
          'voice_' + voiceProvider + '_' + voiceCharacter + '_' + response
        )
        console.log('retrievied url from cache', url)

        if (!url || url === undefined || url?.length <= 0) {
          console.log('generating voice')
          if (voiceProvider === 'uberduck') {
            url = await getAudioUrl(
              process.env.UBER_DUCK_KEY as string,
              process.env.UBER_DUCK_SECRET_KEY as string,
              voiceCharacter,
              response as string
            )
          } else if (voiceProvider === 'google') {
            console.log('discord voice tts:', response)
            // google tts
            url = await tts(response, voiceCharacter, languageCode)
          } else {
            console.log('generating tiktalk voice')
            url = await tts_tiktalknet(response, voiceCharacter, tiktalknet_url)
          }

          cacheManager.instance.set(
            'voice_' + voiceProvider + '_' + voiceCharacter + '_' + response,
            url
          )
        }

        // const url = await tts(response)
        connection.subscribe(audioPlayer)
        console.log('speech url:', url)
        if (url) {
          const audioResource = createAudioResource(url, {
            inputType: StreamType.Arbitrary,
          })
          audioPlayer.play(audioResource)
        }
      }
    }
  })
}

/**
 * Join the voice channel and start listening.
 * @param {Discord.Receiver} receiver
 * @param {Discord.TextChannel} textChannel
 */
export async function recognizeSpeech(textChannel, clientId) {
  console.log('recognizeStream')
  if (textChannel) {
    joinVoiceChannel({
      channelId: textChannel.id,
      guildId: textChannel.guild.id,
      adapterCreator: textChannel.guild.voiceAdapterCreator,
      selfDeaf: false,
      group: 'default_' + clientId,
    })
  }
}
