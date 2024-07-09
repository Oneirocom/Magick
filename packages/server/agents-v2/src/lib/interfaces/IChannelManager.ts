export interface ChannelInterface {
  id: string
  name: string
  type: string
  metadata: Record<string, any>
}

export interface IChannelManager {
  createChannel(
    name: string,
    type: string,
    metadata?: Record<string, any>
  ): Promise<ChannelInterface>
  deleteChannel(channelId: string): Promise<void>
  getChannel(channelId: string): ChannelInterface | undefined
  listChannels(): ChannelInterface[]
  addSpellToChannel(channelId: string, spellId: string): Promise<void>
  removeSpellFromChannel(channelId: string, spellId: string): Promise<void>
  handleEvent(channelId: string, eventName: string, data: any): void
}
