// seraph.ts
import { CognitiveFunctionSchema, convertToXML } from './zod_schemas'
import { ConversationManager } from './conversation_manager'
import { CognitiveFunctionExecutor } from './cognitive_function_executor'
import { ResponseParser } from './response_parser'
import { FeedbackProcessor } from './feedback_processor'
import { SeraphIterator } from './seraph_iterator'
import { BaseCognitiveFunction } from './base_cognitive_function'
import { MiddlewareManager } from './middlewareManager'

type SeraphOptions = {
  prompt: string
  openAIApiKey: string
  anthropicApiKey: string
}
/**
 * The Seraph class represents the main entry point for the AI system.
 * It manages cognitive functions, conversation context, and the cognitive loop.
 */
class Seraph {
  cognitiveFunctions: Record<string, CognitiveFunctionSchema> = {}
  conversationManager: ConversationManager
  cognitiveFunctionExecutor: CognitiveFunctionExecutor
  responseParser: ResponseParser
  feedbackProcessor: FeedbackProcessor
  middlewareManager: MiddlewareManager
  prompt: string
  options: SeraphOptions

  constructor(options: SeraphOptions) {
    this.options = options
    this.conversationManager = new ConversationManager()
    this.cognitiveFunctionExecutor = new CognitiveFunctionExecutor()
    this.responseParser = new ResponseParser(this.cognitiveFunctions)
    this.feedbackProcessor = new FeedbackProcessor()
    this.middlewareManager = new MiddlewareManager()
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
   * Generates the XML description for all registered cognitive functions.
   * @returns The XML description of the cognitive functions.
   */
  public getToolsDescription(): string {
    const toolsXML = Object.values(this.cognitiveFunctions)
      .map(convertToXML)
      .join('\n')

    return toolsXML
  }

  /**
   * Processes user input and generates a response through the cognitive loop.
   * @param userInput The user input to process.
   * @param conversationId The identifier of the conversation.
   * @returns An iterator that yields responses from the cognitive loop.
   */
  public async *processInput(
    userInput: string,
    conversationId: string
  ): AsyncIterableIterator<string> {
    // Update conversation context
    this.conversationManager.updateContext(conversationId, userInput, 'user')

    // Generate response using core prompts and conversation context
    const systemPrompt = this.generateSystemPrompt()

    // Create a SeraphIterator to handle the cognitive loop
    const seraphIterator = new SeraphIterator(
      this,
      conversationId,
      systemPrompt
    )

    // Yield responses from the SeraphIterator
    for await (const iteratorResponse of seraphIterator) {
      yield iteratorResponse
    }
  }

  generateSystemPrompt(): string {
    const toolsDescription = this.getToolsDescription()
    const middlewarePrompts = this.middlewareManager.getMiddlewarePrompts()
    const prompt = `
    This is the Seraph AI system.  This is your core directive and prompt:
    ${this.prompt}

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

  /**
   * Removes the XML tags for function calls and results from the response.
   * @param response The response string.
   * @returns The response string without the XML tags.
   */
  public stripFunctionTags(response: string): string {
    const strippedResponse = response.replace(/<function_calls>/g, '')
    const strippedInvoke = strippedResponse.replace(
      /<invoke>[\s\S]*?<\/invoke>/g,
      ''
    )
    const strippedFunctionResults = strippedInvoke.replace(
      /<function_results>[\s\S]*?<\/function_results>/g,
      ''
    )
    return strippedFunctionResults
  }
}

export { Seraph }
