// base_cognitive_function.ts
import { CognitiveFunctionSchema } from './zod_schemas'

abstract class BaseCognitiveFunction {
  name: string
  description: string
  parameters: Record<string, any>
  examples: string[]

  constructor({
    name,
    description,
    parameters,
    examples,
  }: CognitiveFunctionSchema) {
    this.name = name
    this.description = description
    this.parameters = parameters
    this.examples = examples
  }

  abstract getPromptInjection(): Promise<string>

  abstract execute(args: Record<string, any> | null): Promise<string> | string

  async getFeedback(prompt: string, getUserFeedback: Function) {
    if (typeof getUserFeedback !== 'function') {
      throw new Error('getUserFeedback must be a function.')
    }
    const feedback = await getUserFeedback(prompt)
    return feedback
  }
}

export { BaseCognitiveFunction }
