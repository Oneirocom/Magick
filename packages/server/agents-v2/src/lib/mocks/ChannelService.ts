import { injectable } from 'inversify'
import { ChannelInterface } from '../interfaces/IChannelManager'
import { IChannelService } from '../interfaces/IChannelService'

@injectable()
export class MockChannelService implements IChannelService {
  private channels: ChannelInterface[] = []

  constructor() {
    // Initialize with some mock data
    this.channels = [
      { id: '1', name: 'Channel 1', type: 'text' },
      { id: '2', name: 'Channel 2', type: 'voice' },
    ]
  }

  async loadChannels(): Promise<ChannelInterface[]> {
    return Promise.resolve([...this.channels])
  }

  async createChannel(
    channelData: Omit<ChannelInterface, 'id'>
  ): Promise<ChannelInterface> {
    const newChannel: ChannelInterface = {
      id: String(this.channels.length + 1),
      ...channelData,
    }
    this.channels.push(newChannel)
    return Promise.resolve(newChannel)
  }

  async deleteChannel(id: string): Promise<void> {
    const index = this.channels.findIndex(channel => channel.id === id)
    if (index !== -1) {
      this.channels.splice(index, 1)
      return Promise.resolve()
    }
    return Promise.reject(new Error(`Channel with id ${id} not found`))
  }

  async updateChannel(
    id: string,
    data: Partial<ChannelInterface>
  ): Promise<ChannelInterface> {
    const index = this.channels.findIndex(channel => channel.id === id)
    if (index !== -1) {
      this.channels[index] = { ...this.channels[index], ...data }
      return Promise.resolve(this.channels[index])
    }
    return Promise.reject(new Error(`Channel with id ${id} not found`))
  }
}
