import { Seraph } from './seraph'
import { LLMManager } from './llm_manager'

const ANTHROPIC_API_KEY = process.env['ANTHROPIC_API_KEY']

class SeraphIterator implements AsyncIterator<string> {
  private seraph: Seraph
  private conversationId: string
  private systemPrompt: string
  private llmManager: LLMManager

  constructor(seraph: Seraph, conversationId: string, systemPrompt: string) {
    if (!ANTHROPIC_API_KEY) {
      throw new Error(
        'ANTHROPIC_API_KEY is not defined. Please add to your environment variables.'
      )
    }
    this.seraph = seraph
    this.conversationId = conversationId
    this.systemPrompt = systemPrompt
    this.llmManager = new LLMManager(ANTHROPIC_API_KEY)
  }

  public async next(): Promise<IteratorResult<string>> {
    let result: IteratorResult<string>

    const messages = this.seraph.conversationManager.getMessages(
      this.conversationId
    )

    // Generate a new response from the LLM
    const llmResponse = await this.llmManager.generateResponse(
      this.systemPrompt,
      messages,
      1024
    )

    this.seraph.conversationManager.updateContext(
      this.conversationId,
      llmResponse,
      'assistant'
    )

    // Check if the response contains a function call
    const { functionName, functionArgs } =
      await this.seraph.responseParser.parseFunctionUsage(llmResponse)

    if (functionName) {
      try {
        // Execute the selected cognitive function
        const functionOutput =
          await this.seraph.cognitiveFunctionExecutor.executeFunction(
            functionName,
            functionArgs
          )
        // Process function output and update response
        const updatedResponse = this.seraph.processFunctionOutput(
          functionOutput,
          llmResponse,
          functionName
        )

        // Provide feedback on the response
        this.seraph.feedbackProcessor.processFeedback(updatedResponse)

        // Update conversation context with the updated response as 'user'
        this.seraph.conversationManager.updateContext(
          this.conversationId,
          updatedResponse,
          'user'
        )

        result = {
          done: false,
          value: this.seraph.stripFunctionTags(updatedResponse),
        } // Return the updated response
      } catch (error) {
        console.error('Error executing cognitive function:', error)
        throw error
      }
    } else {
      console.log('DONE!', llmResponse)
      result = { done: true, value: this.seraph.stripFunctionTags(llmResponse) } // Return the response
    }

    return result // Always return a value
  }

  public [Symbol.asyncIterator](): AsyncIterator<string> {
    return this
  }
}

export { SeraphIterator }
