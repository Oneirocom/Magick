// DOCUMENTED 
/**
 * Imports
 */
import { DiscordListChannels } from './nodes/DiscordListChannels';
import { DiscordListTextChannels } from './nodes/DiscordListTextChannels';
import { DiscordListVoiceChannels } from './nodes/DiscordListVoiceChannels';
import { DiscordJoinVoice } from './nodes/DiscordJoinVoice';

/**
 * Export an array of nodes
 */
export default [
  DiscordJoinVoice,
  DiscordListTextChannels,
  DiscordListVoiceChannels,
  DiscordListChannels,
];