import { z } from 'zod'
import { tool, type CoreTool, type inferParameters } from '../../vendor/tool'

type ToolDefinition<PARAMETERS extends z.ZodTypeAny, RESULT> = Omit<
  CoreTool<PARAMETERS, RESULT>,
  'parameters'
> & {
  parameters?: PARAMETERS
}

export function defineTool<PARAMETERS extends z.ZodTypeAny, RESULT>(
  toolDefinition: ToolDefinition<PARAMETERS, RESULT>
): CoreTool<PARAMETERS, RESULT> {
  const { description, execute, parameters } = toolDefinition

  return tool({
    description,
    parameters: (parameters || z.any()) as PARAMETERS,
    execute: execute as (args: inferParameters<PARAMETERS>) => Promise<RESULT>,
  })
}
