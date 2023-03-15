import { VoiceConnection } from '@discordjs/voice'
import { ChannelType, Client, User } from 'discord.js'
import { convertStereoToMono, getDurationFromMonoBuffer } from './audio'
import { SpeechOptions } from './speechOptions'
import VoiceMessage from './VoiceMessage'

export default async ({
  client,
  bufferData,
  user,
  connection,
  speechOptions,
}: {
  client: Client
  bufferData: Uint8Array[]
  user: User
  connection: VoiceConnection
  speechOptions: SpeechOptions
}): Promise<VoiceMessage | undefined> => {
  if (!connection.joinConfig.channelId) return undefined

  const stereoBuffer = Buffer.concat(bufferData)
  const monoBuffer = convertStereoToMono(stereoBuffer)
  const duration = getDurationFromMonoBuffer(monoBuffer)
  if (duration < 1 || duration > 19) return undefined

  let content: string | undefined
  let error: Error | undefined
  try {
    content = await speechOptions.speechRecognition?.(monoBuffer, speechOptions)
  } catch (e) {
    error = e as Error
  }

  const channel = client.channels.cache.get(connection.joinConfig.channelId)
  if (!channel || channel.type !== ChannelType.GuildVoice) return undefined

  const voiceMessage = new VoiceMessage({
    client,
    data: {
      author: user,
      duration,
      audioBuffer: stereoBuffer,
      content,
      error,
      connection,
    },
    channel,
  })
  return voiceMessage
}
