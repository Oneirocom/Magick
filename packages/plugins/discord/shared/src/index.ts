// DOCUMENTED
/**
 * Imports
 */
import { DiscordListTextChannels } from './nodes/DiscordListTextChannels'
import { DiscordListVoiceChannels } from './nodes/DiscordListVoiceChannels'
import { DiscordJoinVoice } from './nodes/DiscordJoinVoice'
import { DiscordLeaveVoice } from './nodes/DiscordLeaveVoice'
import { DiscordVoiceChannelForSender } from './nodes/DiscordVoiceChannelForSender'
import { DiscordLeaveVoiceChannelsInServer } from './nodes/DiscordLeaveVoiceChannelsInServer'
import { MagickComponent } from 'shared/core'

export function getNodes(): MagickComponent<any>[] {
  return [
    DiscordJoinVoice as any,
    DiscordListTextChannels as any,
    DiscordListVoiceChannels as any,
    DiscordLeaveVoice as any,
    DiscordVoiceChannelForSender as any,
    DiscordLeaveVoiceChannelsInServer as any,
  ]
}
/**
 * Export an array of nodes
 */
export default [
  DiscordJoinVoice,
  DiscordListTextChannels,
  DiscordListVoiceChannels,
]
