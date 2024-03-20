import Anthropic from '@anthropic-ai/sdk'
import { Message } from './conversation_manager'
import { MessageStream } from '@anthropic-ai/sdk/lib/MessageStream'

class LLMManager {
  private anthropic: Anthropic

  constructor(apiKey: string) {
    this.anthropic = new Anthropic({ apiKey, maxRetries: 5 })
  }

  streamResponse(
    systemPrompt: string,
    messages: Message[],
    maxTokens: number
  ): MessageStream {
    const stream = this.anthropic.messages.stream({
      model: 'claude-3-opus-20240229',
      stop_sequences: ['</function_calls>'],
      system: systemPrompt,
      max_tokens: maxTokens,
      messages,
    })

    return stream
  }

  async generateResponse(
    systemPrompt: string,
    messages: Message[],
    maxTokens: number
  ): Promise<string> {
    const msg = await this.anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      // model: 'claude-3-sonnet-20240229',
      // model: 'claude-3-haiku-20240307',
      stop_sequences: ['</function_calls>'],
      system: systemPrompt,
      max_tokens: maxTokens,
      messages,
    })

    return msg?.content[0]?.text
  }
}

export { LLMManager }
