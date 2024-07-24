import { inject, injectable } from 'inversify'
import { TYPES } from './dependency.config'
import {
  ChannelInterface,
  IChannelManager,
} from '../interfaces/IChannelManager'
import { EventPayload } from '../interfaces/IEvent'
import { Agent } from '../Agent'
import { IEventRouter } from '../interfaces/IEventRouter'
import { ISpellbookLibrary } from '../interfaces/ISpellbookLibrary'
import { IChannelService } from '../interfaces/IChannelService'

declare module '../Agent' {
  interface BaseAgentEvents {
    'channel:created': (channel: ChannelInterface) => Promise<void> | void
    'channel:updated': (channel: ChannelInterface) => Promise<void> | void
    'channel:deleted': (id: string) => Promise<void> | void
  }
}

@injectable()
export class ChannelManager implements IChannelManager {
  private channels: Map<string, ChannelInterface> = new Map()

  constructor(
    @inject(TYPES.Agent) private agent: Agent,
    @inject(TYPES.ChannelService) private channelService: IChannelService,
    @inject(TYPES.EventRouter) private eventRouter: IEventRouter,
    @inject(TYPES.SpellbookLibrary) private spellbookLibrary: ISpellbookLibrary
  ) {}

  async initialize(): Promise<void> {
    await this.loadChannels()
  }

  private async loadChannels(): Promise<void> {
    const channels = await this.channelService.loadChannels()
    for (const channel of channels) {
      await this.initializeChannel(channel)
    }
  }

  private async initializeChannel(channel: ChannelInterface): Promise<void> {
    this.channels.set(channel.id, channel)
    const spellbook = await this.spellbookLibrary.addSpellbook(channel)
    this.eventRouter.registerChannel(
      channel.id,
      spellbook.handleEvent.bind(spellbook)
    )
  }

  async createChannel(
    channelData: Omit<ChannelInterface, 'id'>
  ): Promise<ChannelInterface> {
    const newChannel = await this.channelService.createChannel(channelData)
    await this.initializeChannel(newChannel)
    this.agent.emit('channel:created', newChannel)
    return newChannel
  }

  async deleteChannel(id: string): Promise<void> {
    const channel = this.channels.get(id)
    if (!channel) {
      throw new Error(`Channel with id ${id} not found`)
    }

    await this.spellbookLibrary.removeSpellbook(id)
    await this.channelService.deleteChannel(id)
    this.channels.delete(id)
    this.eventRouter.unregisterChannel(id)
    this.agent.emit('channel:deleted', id)
  }

  async updateChannel(
    id: string,
    data: Partial<ChannelInterface>
  ): Promise<ChannelInterface> {
    const updatedChannel = await this.channelService.updateChannel(id, data)
    this.channels.set(id, updatedChannel)
    this.agent.emit('channel:updated', updatedChannel)
    return updatedChannel
  }

  getChannel(id: string): ChannelInterface | undefined {
    return this.channels.get(id)
  }

  getChannels(): ChannelInterface[] {
    return Array.from(this.channels.values())
  }

  async handleEvent(
    channelId: string,
    eventName: string,
    data: EventPayload
  ): Promise<void> {
    const spellbook = this.spellbookLibrary.getSpellbook(channelId)
    if (spellbook) {
      await spellbook.handleEvent(eventName, data)
    } else {
      throw new Error(`No spellbook found for channel ${channelId}`)
    }
  }
}
