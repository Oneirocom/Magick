// DOCUMENTED 
import { VoiceConnection } from '@discordjs/voice';
import { ChannelType, Client, User } from 'discord.js';
import { convertStereoToMono, getDurationFromMonoBuffer } from './audio';
import { SpeechOptions } from './speechOptions';
import VoiceMessage from './VoiceMessage';

/**
 * Creates a voice message from the given buffer data after processing the content using speech recognition.
 *
 * @param client - The discord client.
 * @param bufferData - An array of unsigned 8-bit integers, representing stereo audio data.
 * @param user - The user associated with the voice message.
 * @param connection - The voice connection to the Discord channel.
 * @param speechOptions - The options for configuring speech recognition.
 * @returns A promise that resolves to a VoiceMessage object or undefined.
 */
export default async ({
  client,
  bufferData,
  user,
  connection,
  speechOptions,
}: {
  client: Client;
  bufferData: Uint8Array[];
  user: User;
  connection: VoiceConnection;
  speechOptions: SpeechOptions;
}): Promise<VoiceMessage | undefined> => {
  // If the connection's channel ID is not available or undefined, return undefined
  if (!connection.joinConfig.channelId) return undefined;

  // Convert the stereo audio data to a mono buffer and compute its duration
  const stereoBuffer = Buffer.concat(bufferData);
  const monoBuffer = convertStereoToMono(stereoBuffer);
  const duration = getDurationFromMonoBuffer(monoBuffer);

  // If the duration is out of the valid range, return undefined
  if (duration < 1 || duration > 19) return undefined;

  // Initialize content and error variables
  let content: string | undefined;
  let error: Error | undefined;

  // Try to recognize speech from the mono buffer, and catch any errors
  try {
    content = await speechOptions.speechRecognition?.(monoBuffer, speechOptions);
  } catch (e) {
    error = e as Error;
  }

  // Get the channel from the client's cache and ensure it's a GuildVoice channel
  const channel = client.channels.cache.get(connection.joinConfig.channelId);
  if (!channel || channel.type !== ChannelType.GuildVoice) return undefined;

  // Create and return a new VoiceMessage instance
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
  });
  return voiceMessage;
};
