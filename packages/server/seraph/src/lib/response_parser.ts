// response_parser.ts
import { parseStringPromise } from 'xml2js'
import { CognitiveFunctionSchema } from './zod_schemas'

class ResponseParser {
  private cognitiveFunctions: Record<string, CognitiveFunctionSchema>

  constructor(cognitiveFunctions: Record<string, CognitiveFunctionSchema>) {
    this.cognitiveFunctions = cognitiveFunctions
  }

  public async parseFunctionUsage(response: string): Promise<{
    functionName: string | null
    functionArgs: Record<string, any> | null
  }> {
    try {
      const functionCallMatch = /<invoke>(.*?)<\/invoke>/s.exec(response)
      if (functionCallMatch) {
        const functionCallXml = functionCallMatch[0]
        console.log('Function call:', functionCallXml)
        const parsedXml = await parseStringPromise(functionCallXml)

        const invoke = parsedXml['invoke']
        if (
          invoke &&
          invoke['tool_name'] &&
          invoke['tool_name'].length > 0 &&
          invoke['parameters'] &&
          invoke['parameters'].length > 0
        ) {
          const functionName = invoke['tool_name'][0]
          const functionSchema = this.cognitiveFunctions[functionName]

          if (functionSchema) {
            const functionArgs: Record<string, any> = {}
            const parameters = invoke['parameters'][0]
            for (const param of Object.keys(parameters)) {
              if (
                Array.isArray(parameters[param]) &&
                parameters[param].length > 0
              ) {
                const paramValue = parameters[param][0]
                const paramType = functionSchema.parameters[param].type
                functionArgs[param] = convertValueToType(paramValue, paramType)
              }
            }
            return { functionName, functionArgs }
          }
        }
      }

      return { functionName: null, functionArgs: null }
    } catch (error) {
      console.log('Error parsing function in response:', response)
      console.error(error)
      return { functionName: null, functionArgs: null }
    }
  }
}

function convertValueToType(value: string, type: string): any {
  switch (type) {
    case 'number':
      return parseFloat(value)
    case 'boolean':
      return value.toLowerCase() === 'true'
    default:
      return value
  }
}

export { ResponseParser }
