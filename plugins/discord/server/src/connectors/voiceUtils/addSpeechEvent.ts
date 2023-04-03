// DOCUMENTED 
import { Client } from 'discord.js';
import setupSpeechEvent from './speech';
import setupVoiceJoinEvent from './voiceJoin';
import { resolveSpeechWithGoogleSpeechV2 } from './googleV2';
import { SpeechOptions } from './speechOptions';

/**
 * Adds speech-to-text events to an existing Discord client.
 * @param {Client} client - The Discord client instance to attach the events to.
 * @param {SpeechOptions} [options] - Optional configuration for the speech recognition.
 * @example
 * const client = new Client({
 *   intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES],
 * });
 * addSpeechEvent(client, { lang: "pl-PL" });
 */
export const addSpeechEvent = (client: Client, options?: SpeechOptions): void => {
  // Set default options for speech recognition
  const defaultOptions: SpeechOptions = {
    lang: 'en-US',
    speechRecognition: resolveSpeechWithGoogleSpeechV2,
    ignoreBots: true,
  };

  // Merge user provided options with default options
  const speechOptions = { ...defaultOptions, ...options };

  // Setup voice join event
  setupVoiceJoinEvent(client, speechOptions);

  // Setup speech event
  setupSpeechEvent(client, speechOptions);
};