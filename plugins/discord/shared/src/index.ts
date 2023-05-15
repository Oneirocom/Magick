// DOCUMENTED 
/**
 * Imports
 */
import { DiscordListTextChannels } from './nodes/DiscordListTextChannels';
import { DiscordListVoiceChannels } from './nodes/DiscordListVoiceChannels';
import { DiscordJoinVoice } from './nodes/DiscordJoinVoice';
import { DiscordLeaveVoice } from './nodes/DiscordLeaveVoice';
import { BabyAGI } from './nodes/BabyAGI';
import { MagickComponent } from '@magickml/core';


export function getNodes(): MagickComponent<any>[] {
  return [
  DiscordJoinVoice as any,
  DiscordListTextChannels as any,
  DiscordListVoiceChannels as any,
  BabyAGI as any,
  DiscordLeaveVoice as any,
]
}
/**
 * Export an array of nodes
 */
export default [
  DiscordJoinVoice,
  BabyAGI,
  DiscordListTextChannels,
  DiscordListVoiceChannels,
];