import { EventPayload } from 'server/plugin'
import { DiscordAgentContext, type DiscordEventPayload } from '../configx'
import Natural from 'natural'

export class DiscordMessageUtils {
  private agentId: string
  tokenizer = new Natural.SentenceTokenizer()

  constructor(agentId: string) {
    this.agentId = agentId
  }

  public checkIfBotMessage<K extends keyof DiscordEventPayload>(
    payload: DiscordEventPayload[K]
  ) {
    return 'author' in payload && payload.author?.bot
  }

  public parseContent<K extends keyof DiscordEventPayload>(
    payload: DiscordEventPayload[K]
  ) {
    if ('content' in payload) {
      return payload.content
    }
    if ('emoji' in payload) {
      return payload.emoji.name ?? ''
    }
    return ''
  }

  public parseSender<K extends keyof DiscordEventPayload>(
    payload: DiscordEventPayload[K]
  ) {
    if ('author' in payload) {
      return payload.author?.id ?? ''
    }
    return ''
  }

  public parseChannel<K extends keyof DiscordEventPayload>(
    payload: DiscordEventPayload[K]
  ) {
    if ('channelId' in payload) {
      return payload.channelId as string
    }
    return ''
  }

  public tokenizeIntoSentences(content: string) {
    return this.tokenizer.tokenize(content)
  }

  public splitLongSentence(sentence: string, maxLength: number) {
    // Split the sentence at logical points, such as punctuation or conjunctions.
    const splitRegex = /,|;|\s-\s/ // Split at commas, semicolons, or dashes. You can refine this regex based on your needs.
    const parts = [] as string[]
    let currentPart = ''

    sentence.split(splitRegex).forEach((chunk, index, array) => {
      if (currentPart.length + chunk.length < maxLength) {
        currentPart +=
          index < array.length - 1 ? chunk + array[index + 1].charAt(0) : chunk
      } else {
        parts.push(currentPart)
        currentPart = chunk
      }
    })

    if (currentPart) {
      parts.push(currentPart)
    }

    return parts
  }

  public createEventPayload<K extends keyof DiscordEventPayload>(
    eventName: K,
    payload: DiscordEventPayload[K],
    context: DiscordAgentContext | null | undefined,
    metadata = {}
  ): EventPayload<DiscordEventPayload[K]> {
    return {
      connector: 'discord',
      eventName,
      status: 'success',
      content: this.parseContent(payload),
      sender: this.parseSender(payload),
      observer: 'assistant',
      client: 'cloud.magickml.com',
      channel: this.parseChannel(payload),
      plugin: 'discord',
      agentId: this.agentId,
      channelType: 'discord',
      rawData: JSON.stringify(payload),
      timestamp: new Date().toISOString(),
      data: payload,
      metadata: {
        context,
        ...metadata,
      },
    }
  }
}
