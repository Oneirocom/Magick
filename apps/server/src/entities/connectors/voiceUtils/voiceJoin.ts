import { getVoiceConnection, VoiceConnection } from '@discordjs/voice'
import { Client } from 'discord.js'
import { SpeechOptions } from './speechOptions'

/**
 * It's a bit hacky solution to check if speech handler has been already attached to connection receiver
 * It does it by checking if in the listeners of speaking map exists function with the same name as function
 * which handles speech event
 * @param connection
 * @returns
 */
const isSpeechHandlerAttachedToConnection = (
  connection: VoiceConnection
): boolean => {
  return Boolean(
    connection.receiver.speaking
      .listeners('start')
      .find(func => func.name === 'handleSpeechEventOnConnectionReceiver')
  )
}

export default (client: Client, speechOptions: SpeechOptions): void => {
  client.on('voiceStateUpdate', (_old, newVoiceState) => {
    if (!newVoiceState.channel) return

    const connection = getVoiceConnection(
      newVoiceState.channel.guild.id,
      speechOptions.group
    )
    if (connection && !isSpeechHandlerAttachedToConnection(connection))
      client.emit(
        'voiceJoin',
        getVoiceConnection(newVoiceState.channel.guild.id, speechOptions.group)
      )
  })
}
