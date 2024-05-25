import { EventEmitter } from 'events'
import { v4 as uuidv4 } from 'uuid'
import { EventPayload } from 'server/plugin'
import { prismaCore } from '@magickml/server-db'
import { EventStore, SpellCaster } from 'server/grimoire'
import { CORE_DEP_KEYS } from '../../config'

export type Memory = {
  id: string
  role: 'user' | 'assistant'
  agentId: string
  channel: string
  content: string
  type?: string
  event: EventPayload
  createdAt: Date
}

export class MemoryStreamService extends EventEmitter {
  private agentId: string
  private spellCaster: SpellCaster
  private prisma: typeof prismaCore
  // private vectorStore: PrismaVectorStore<
  //   Memory,
  //   string,
  //   {
  //     id: true
  //     content: true
  //   },
  //   PrismaSqlFilter<Memory>
  // >

  constructor(agentId: string, spellCaster: SpellCaster) {
    super()
    this.agentId = agentId
    this.spellCaster = spellCaster
    this.prisma = prismaCore
    // this.vectorStore = PrismaVectorStore.withModel<Memory>(this.prisma).create(
    //   new OpenAIEmbeddings(),
    //   {
    //     prisma: this.prisma as PrismaClient,
    //     tableName: 'Memory',
    //     vectorColumnName: 'vector',
    //     columns: {
    //       id: PrismaVectorStore.IdColumn,
    //       content: PrismaVectorStore.ContentColumn,
    //     },
    //   }
    // )
  }

  get eventStore(): EventStore {
    const eventStore = this.spellCaster.graph.getDependency<EventStore>(
      CORE_DEP_KEYS.EVENT_STORE
    )

    if (!eventStore) {
      throw new Error('Event store not found')
    }

    return eventStore
  }

  get currentEvent() {
    const currentEvent = this.eventStore.currentEvent()
    if (!currentEvent) {
      throw new Error('Current event not found')
    }

    return currentEvent
  }

  async addMemory({
    content,
    role = 'assistant',
    type,
  }: {
    content: string
    role: 'user' | 'assistant'
    type?: string
  }) {
    const newMemory: Memory = {
      content: content,
      role: role,
      type: type,
      agentId: this.agentId,
      event: this.currentEvent,
      channel: this.currentEvent.channel,
      // Cast 'event' property to 'InputJsonObject'
      id: generateUniqueId(),
      createdAt: new Date(),
    }

    // Write to the database and add to vector store
    const createdMemory = (await this.prisma.memory.create({
      data: newMemory,
    })) as Memory
    // await this.vectorStore.addModels([createdMemory])

    this.emit('memoryAdded', createdMemory)

    return {
      memory: createdMemory,
      message: {
        role: createdMemory.role,
        content: createdMemory.content,
      },
    }
  }

  async deleteMemory(id: string) {
    // Delete from the database and vector store
    const deletedMemory = await this.prisma.memory.delete({ where: { id } })
    // await this.vectorStore.delete(deletedMemory)

    this.emit('memoryDeleted', deletedMemory)

    return deletedMemory
  }

  async clearMemories(filter: Partial<Omit<Memory, 'event'>>) {
    // Delete from the database and vector store
    const deletedMemories = await this.prisma.memory.deleteMany({
      where: {
        channel: this.currentEvent.channel,
        agentId: this.agentId,
        ...filter,
      },
    })
    // await this.vectorStore.deleteMany(deletedMemories)

    this.emit('memoriesCleared', deletedMemories)

    return deletedMemories
  }

  async getMemories(
    limit = 10,
    filter: Partial<Omit<Memory, 'event'>>,
    types: string[] = []
  ) {
    const typeFilter = types.length > 0 ? { type: { in: types } } : {}

    const memories = (
      await this.prisma.memory.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' },
        where: {
          channel: this.currentEvent.channel,
          agentId: this.agentId,
          ...typeFilter,
          ...filter,
        },
      })
    ).reverse()

    const messages = this.formatMemories(memories as Memory[])

    return {
      memories,
      messages,
    }
  }

  formatMemories(memories: Memory[]) {
    return memories.map(memory => {
      return {
        role: memory.role,
        content: memory.content,
      }
    })
  }

  async withMonologue(content: string, type?: string) {
    return this.addMemory({
      role: 'assistant',
      content,
      type,
    })
  }

  // async similaritySearch(query: string, k: number) {
  //   return this.vectorStore.similaritySearch(query, k)
  // }
}

function generateUniqueId() {
  return uuidv4()
}
