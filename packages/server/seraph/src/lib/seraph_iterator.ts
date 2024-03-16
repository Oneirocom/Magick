import { Seraph } from './seraph'
import { LLMManager } from './llm_manager'

class SeraphIterator implements AsyncIterator<string> {
  private seraph: Seraph
  private conversationId: string
  private systemPrompt: string
  private llmManager: LLMManager
  private done: boolean = false

  constructor(seraph: Seraph, conversationId: string, systemPrompt: string) {
    this.seraph = seraph
    this.conversationId = conversationId
    this.systemPrompt = systemPrompt
    this.llmManager = new LLMManager(seraph.options.anthropicApiKey)
  }

  public async next(): Promise<IteratorResult<string>> {
    if (this.done) {
      return { done: true, value: undefined }
    }

    const messages = this.seraph.conversationManager.getMessages(
      this.conversationId
    )

    // Generate a new response from the LLM
    const llmResponse = await this.llmManager.generateResponse(
      this.systemPrompt,
      messages,
      1024
    )

    this.seraph.middlewareManager.runMiddleware(
      llmResponse,
      this.conversationId
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

        this.done = false
        return {
          done: false,
          value: this.seraph.stripFunctionTags(updatedResponse),
        } // Return the updated response/ Yield the stripped LLM response
      } catch (error) {
        console.error('Error executing cognitive function:', error)
        throw error
      }
    } else {
      const strippedResponse = this.seraph.stripFunctionTags(llmResponse)
      this.done = true // Mark the iterator as done
      return { done: false, value: strippedResponse }
    }
  }

  public [Symbol.asyncIterator](): AsyncIterator<string> {
    return this
  }
}

export { SeraphIterator }
