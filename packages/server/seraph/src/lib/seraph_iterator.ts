import { SeraphCore } from './seraphCore'
import { LLMManager } from './llm_manager'
// import { ConsoleLogWriter } from 'drizzle-orm'

class SeraphIterator implements AsyncIterator<string> {
  private seraph: SeraphCore
  private conversationId: string
  private systemPrompt: string
  private llmManager: LLMManager
  private done: boolean = false

  constructor(
    seraph: SeraphCore,
    conversationId: string,
    systemPrompt: string
  ) {
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

    let insideMessage = false
    // const partialOpeningTag = ''

    const stream = this.llmManager.streamResponse(
      this.systemPrompt,
      messages,
      4000
    )

    stream.on('text', token => {
      if (insideMessage) {
        if (token === '</message>') {
          insideMessage = false
          this.seraph.emit('token', '<END>')
        } else {
          this.seraph.emit('token', token)
        }
      } else {
        if (token === '<message>') {
          // Compare with the full opening tag
          insideMessage = true
          this.seraph.emit('token', '<START>')
        }
      }
    })

    const finalMessage = await stream.finalMessage()

    const llmResponse = finalMessage?.content[0]?.text || ''

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
        const message = this.seraph.extractMessage(updatedResponse)

        return {
          done: false,
          value: message || '',
        } // Return the updated response/ Yield the stripped LLM response
      } catch (error) {
        console.error('Error executing cognitive function:', error)
        throw error
      }
    } else {
      const message = this.seraph.extractMessage(llmResponse)
      this.done = true // Mark the iterator as done
      return { done: false, value: message || '' }
    }
  }

  public [Symbol.asyncIterator](): AsyncIterator<string> {
    return this
  }
}

export { SeraphIterator }
