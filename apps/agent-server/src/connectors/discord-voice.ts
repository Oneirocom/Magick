import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  StreamType,
  VoiceConnectionStatus,
  NoSubscriberBehavior,
} from '@discordjs/voice'
import { createReadStream } from 'fs'

import { removeEmojisFromString } from '@magickml/utils'
import { tts, tts_tiktalknet } from '@magickml/systems'

import { addSpeechEvent } from './voiceUtils/addSpeechEvent'

//const transcriber = new Transcriber('288916776772018')
export function initSpeechClient({
  client,
  discord_bot_name,
  agent,
  spellHandler,
  voiceProvider,
  voiceCharacter,
  languageCode,
  tiktalknet_url
}) {
  addSpeechEvent(client, { group: 'default_' + agent.id })
  const audioPlayer = createAudioPlayer({
    behaviors: {
      noSubscriber: NoSubscriberBehavior.Play,
    },
    debug: true,
  })
  client.on('speech', async msg => {
    console.log('msg is ', msg)
    const content = msg.content
    const connection = msg.connection
    const author = msg.author
    const channel = msg.channel

    connection.subscribe(audioPlayer)

    console.log('got voice input:', content)
    if (content) {
      const entities: {
        user: string
        inConversation: boolean
        isBot: boolean
        info3d: string
      }[] = []

      try {
        for (const [memberID, member] of channel.members) {
          entities.push({
            user: member.user.username,
            inConversation: this.isInConversation(member.user.id),
            isBot: member.user.bot,
            info3d: '',
          })
        }
      } catch (e) {}

      console.log(entities)
      const fullResponse = await spellHandler({
        content,
        speaker: author?.username ?? 'VoiceSpeaker',
        agent: discord_bot_name,
        client: 'discord',
        channel: channel.id,
        agentId: agent.id,
        entities,
        channelType: 'voice',
      })
      let response = Object.values(fullResponse)[0] as string

      if (response === undefined || !response || response.length <= 0) {
        return
      }

      response = removeEmojisFromString(response as string)

      console.log('response is', response)
      let url
      if (response) {
        if (voiceProvider === 'google') {
          console.log('discord voice tts:', response)
          // google tts
          url = await tts(response, voiceCharacter, languageCode)
        } else {
          url = await tts_tiktalknet(response, voiceCharacter, tiktalknet_url)
        }
        if (url) {
          // const url = await tts(response)
          console.log('speech url:', url)
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
      selfMute: false, // this may also be needed
    })
  }
}
