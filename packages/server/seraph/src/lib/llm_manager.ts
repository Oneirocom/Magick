import Anthropic from '@anthropic-ai/sdk'
import { Message } from './conversation_manager'

class LLMManager {
  private anthropic: Anthropic

  constructor(apiKey: string) {
    this.anthropic = new Anthropic({ apiKey })
  }

  async generateResponse(
    systemPrompt: string,
    messages: Message[],
    maxTokens: number
  ): Promise<string> {
    const msg = await this.anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      stop_sequences: ['</function_calls>'],
      system: systemPrompt,
      max_tokens: maxTokens,
      messages,
    })

    return msg.content[0].text
  }
}

export { LLMManager }
