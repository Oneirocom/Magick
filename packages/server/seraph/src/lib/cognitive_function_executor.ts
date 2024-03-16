// cognitive_function_executor.ts
import chalk from 'chalk'
import { BaseCognitiveFunction } from './base_cognitive_function'

/**
 * The CognitiveFunctionExecutor class executes cognitive functions.
 */
class CognitiveFunctionExecutor {
  private cognitiveFunctions: Record<string, BaseCognitiveFunction> = {}

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

    console.log(chalk.blue('Executing function', functionName))

    const result = await cognitiveFunction.execute(functionArgs)

    console.log(chalk.blue(`Function ${functionName} result:`, result))

    return result
  }
}

export { CognitiveFunctionExecutor }
