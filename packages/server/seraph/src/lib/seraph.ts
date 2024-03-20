// seraph.ts
import { convertToXML } from './zod_schemas'
import TypedEmitter from 'typed-emitter'
import { ConversationManager } from './conversation_manager'
import { CognitiveFunctionExecutor } from './cognitive_function_executor'
import { ResponseParser } from './response_parser'
import { FeedbackProcessor } from './feedback_processor'
import { SeraphIterator } from './seraph_iterator'
import { BaseCognitiveFunction } from './base_cognitive_function'
import { IMiddleware, MiddlewareManager } from './middlewareManager'
import EventEmitter from 'events'

type SeraphEvents = {
  error: (error: Error | string) => void
  message: (role: 'user' | 'assistant', message: string) => void
  info: (info: string, data?: Record<string, unknown>) => void
  token: (token: string) => void
  functionExecution: (functionName: string) => void
  functionResult: (functionName: string, result: string) => void
  middlewareExecution: (middlewareName: string) => void
  middlewareResult: (middlewareName: string, result: string) => void
}

type SeraphOptions = {
  prompt: string
  openAIApiKey: string
  anthropicApiKey: string
}
/**
 * The Seraph class represents the main entry point for the AI system.
 * It manages cognitive functions, conversation context, and the cognitive loop.
 */
class Seraph extends (EventEmitter as new () => TypedEmitter<SeraphEvents>) {
  cognitiveFunctions: Record<string, BaseCognitiveFunction> = {}
  conversationManager: ConversationManager
  cognitiveFunctionExecutor: CognitiveFunctionExecutor
  responseParser: ResponseParser
  feedbackProcessor: FeedbackProcessor
  middlewareManager: MiddlewareManager
  prompt: string
  options: SeraphOptions
  disableInput: boolean = false

  constructor(options: SeraphOptions) {
    super()
    this.options = options
    this.conversationManager = new ConversationManager()
    this.cognitiveFunctionExecutor = new CognitiveFunctionExecutor(this)
    this.responseParser = new ResponseParser(this.cognitiveFunctions)
    this.feedbackProcessor = new FeedbackProcessor()
    this.middlewareManager = new MiddlewareManager(this)
    this.prompt = options.prompt
  }

  /**
   * Adds content to the prompt.
   * @param content The content to add to the prompt.
   */
  public addToPrompt(content: string): void {
    this.prompt += content
  }

  /**
   * Clears the prompt.
   */
  public clearPrompt(): void {
    this.prompt = ''
  }

  /**
   * Registers a cognitive function with the AI system.
   * @param cognitiveFunction The cognitive function to register.
   */
  public registerCognitiveFunction(
    cognitiveFunction: BaseCognitiveFunction
  ): void {
    this.cognitiveFunctionExecutor.registerFunction(cognitiveFunction)
    this.cognitiveFunctions[cognitiveFunction.name] = cognitiveFunction
  }

  /**
   * Registers a middleware with the AI system.
   * Middleware is used to process the response of the AI system, and can be used to perform side effects.
   * @param middleware
   */
  public registerMiddleware(middleware: IMiddleware) {
    this.middlewareManager.registerMiddleware(middleware)
  }

  /**
   * Generates the XML description for all registered cognitive functions.
   * @returns The XML description of the cognitive functions.
   */
  public async getToolsDescription(): Promise<string> {
    const toolsXML = await Promise.all(
      Object.values(this.cognitiveFunctions).map(async func => {
        const xml = convertToXML(func)
        const prompt = await func.getPromptInjection()
        return `${xml}\n${prompt}`
      })
    )

    return toolsXML.join('\n')
  }

  /**
   * Processes user input and generates a response through the cognitive loop.
   * @param userInput The user input to process.
   * @param conversationId The identifier of the conversation.
   * @returns An iterator that yields responses from the cognitive loop.
   */
  public async *processInput(
    userInput: string,
    conversationId: string,
    iterate: boolean = true
  ): AsyncIterableIterator<string> {
    // Update conversation context
    if (this.disableInput) return

    this.conversationManager.updateContext(conversationId, userInput, 'user')

    // Generate response using core prompts and conversation context
    const systemPrompt = await this.generateSystemPrompt()

    // Create a SeraphIterator to handle the cognitive loop
    const seraphIterator = new SeraphIterator(
      this,
      conversationId,
      systemPrompt
    )

    this.disableInput = true

    // Yield responses from the SeraphIterator
    for await (const iteratorResponse of seraphIterator) {
      this.emit('message', 'assistant', iteratorResponse)
      if (iterate) {
        yield iteratorResponse
      }
    }
    this.disableInput = false
  }

  async generateSystemPrompt(): Promise<string> {
    const toolsDescription = await this.getToolsDescription()
    const middlewarePrompts =
      await this.middlewareManager.getMiddlewarePrompts()
    const prompt = `
    <system_prompt>
    This is the Seraph AI system.  This is your core directive and prompt:
    ${this.prompt}
    </system_prompt>

    <user_instructions>
    In this environment you have access to a set of tools you can use to answer the user's question and help them to accomplish their tasks.

    You may call them like this:
    <function_calls>
    <invoke>
    <tool_name>$TOOL_NAME</tool_name>
    <parameters>
    <$PARAMETER_NAME>$PARAMETER_VALUE</$PARAMETER_NAME>
    ...
    </parameters>
    </invoke>
    </function_calls> 

    Here are the tools available:
    ${toolsDescription}
    
    You have the ability to call side effect functions that will not return a response, but will perform an action.  The available actions are:

    ${middlewarePrompts}

    When calling a middleware, start off with the <middleware_instructions> tag, and then include the middleware name and parameters.  For example:

    <middleware_instructions>
    <middleware_name>$MIDDLEWARE_NAME</middleware_name>
    <parameters>
    <$PARAMETER_NAME>$PARAMETER_VALUE</$PARAMETER_NAME>
    ...
    </parameters>
    </middleware_instructions>
    </user_instructions>

    <formatting_instructions>
    When you return a message for the user, you can use the <message> tag to format the message.  For example:

    <message>
    This is the message to the user.
    </message>
    `

    return prompt
  }

  /**
   * Processes the output of a cognitive function and updates the response.
   * @param functionOutput The output of the cognitive function.
   * @param response The current response.
   * @returns The updated response.
   */
  processFunctionOutput(
    functionOutput: string,
    response: string,
    functionName: string
  ): string {
    const updatedResponse = `${response}<function_results><result><tool_name>${functionName}</tool_name><stdout>${functionOutput}</stdout></result></function_results>`
    return updatedResponse
  }

  extractMessage(response: string): string | null {
    const messageRegex = /<message>([\s\S]*?)<\/message>/
    const match = response.match(messageRegex)

    if (match && match.length > 1) {
      return match[1].trim()
    }

    return null
  }
}

export { Seraph }
