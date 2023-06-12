// DOCUMENTED 
import { getVoiceConnection, VoiceConnection } from '@discordjs/voice';
import { Client } from 'discord.js';
import { SpeechOptions } from './speechOptions';

/**
 * Helper function to check if speech handler is already attached to connection receiver.
 * The hacky solution involves checking if there is a function with the same name as
 * the one handling speech events in the listeners of the speaking map.
 *
 * @param connection - VoiceConnection instance
 * @returns true if the speech handler is attached, false otherwise
 */
const isSpeechHandlerAttachedToConnection = (
  connection: VoiceConnection
): boolean => {
  return Boolean(
    (connection.receiver.speaking as any)
      .listeners('start')
      // @ts-ignore
      .find((func) => func.name === 'handleSpeechEventOnConnectionReceiver')
  );
};

/**
 * Main export function that attaches the speech handler to the voice connection.
 * It listens for `voiceStateUpdate` events and emits a `voiceJoin` event when appropriate.
 *
 * @param client - Discord Client instance
 * @param speechOptions - SpeechOptions object
 */
export default (client: Client, speechOptions: SpeechOptions): void => {
  client.on('voiceStateUpdate', (_old, newVoiceState) => {
    if (!newVoiceState.channel) return;

    const connection = getVoiceConnection(
      newVoiceState.channel.guild.id,
      speechOptions.group
    );

    if (connection && !isSpeechHandlerAttachedToConnection(connection)) {
      client.emit(
        'voiceJoin',
        getVoiceConnection(newVoiceState.channel.guild.id, speechOptions.group)
      );
    }
  });
};