// cognitive_function_executor.ts
import { BaseCognitiveFunction } from './base_cognitive_function'
import { SeraphCore } from './seraphCore'
import { SeraphFunction } from './types'

/**
 * The CognitiveFunctionExecutor class executes cognitive functions.
 */
class CognitiveFunctionExecutor {
  private cognitiveFunctions: Record<string, BaseCognitiveFunction> = {}
  seraph: SeraphCore

  constructor(seraph: SeraphCore) {
    this.seraph = seraph
  }

  /**
   * Registers a cognitive function.
   * @param functionSchema The schema of the cognitive function.
   * @param functionImpl The implementation of the cognitive function.
   */
  public registerFunction(cognitiveFunction: BaseCognitiveFunction): void {
    this.cognitiveFunctions[cognitiveFunction.name] = cognitiveFunction
  }

  /**
   * Executes a cognitive function based on its name and arguments.
   * @param functionName The name of the cognitive function to execute.
   * @param functionArgs The arguments to pass to the cognitive function.
   * @returns A promise that resolves to the output of the cognitive function.
   * @throws An error if the cognitive function is not found.
   */
  public async executeFunction(
    functionName: string,
    functionArgs: Record<string, any> | null
  ): Promise<string> {
    const cognitiveFunction = this.cognitiveFunctions[functionName]
    if (!cognitiveFunction) {
      throw new Error(`Cognitive function '${functionName}' not found.`)
    }

    const fnStartPayload: SeraphFunction = {
      name: cognitiveFunction.name,
      messageTitle: `${cognitiveFunction.name}`,
      message: `${cognitiveFunction.name} started`,
    }

    this.seraph.emit('functionExecution', fnStartPayload)

    const result = await cognitiveFunction.execute(functionArgs)

    const fnResultPayload: SeraphFunction = {
      name: cognitiveFunction.name,
      messageTitle: `${cognitiveFunction.name}`,
      message: `${cognitiveFunction.name} finished`,
      result,
    }

    this.seraph.emit('functionResult', fnResultPayload)

    return result
  }
}

export { CognitiveFunctionExecutor }
