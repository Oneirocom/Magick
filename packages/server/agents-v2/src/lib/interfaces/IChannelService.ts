import { ChannelInterface } from './IChannelManager'

export interface IChannelService {
  loadChannels(): Promise<ChannelInterface[]>
  createChannel(
    channelData: Omit<ChannelInterface, 'id'>
  ): Promise<ChannelInterface>
  deleteChannel(id: string): Promise<void>
  updateChannel(
    id: string,
    data: Partial<ChannelInterface>
  ): Promise<ChannelInterface>
}
