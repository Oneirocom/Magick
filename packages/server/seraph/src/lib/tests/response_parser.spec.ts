// response_parser.spec.ts
import { ResponseParser } from '../response_parser'
import { CognitiveFunctionSchema } from '../zod_schemas'

describe('ResponseParser', () => {
  let responseParser: ResponseParser
  const cognitiveFunctions: Record<string, CognitiveFunctionSchema> = {
    mockFunction: {
      name: 'mockFunction',
      description: 'A mock function',
      parameters: {
        param1: { type: 'string', description: 'Parameter 1' },
        param2: { type: 'number', description: 'Parameter 2' },
        param3: { type: 'boolean', description: 'Parameter 3' },
      },
      examples: [],
    },
  }

  beforeEach(() => {
    responseParser = new ResponseParser(cognitiveFunctions)
  })

  it('should parse the XML function call format correctly', async () => {
    const response = `
      This is some text before the function call.

      <function_calls>
        <invoke>
          <tool_name>mockFunction</tool_name>
          <parameters>
            <param1>value1</param1>
            <param2>42</param2>
            <param3>true</param3>
          </parameters>
        </invoke>
      </function_calls>

      This is some text after the function call.
    `

    const { functionName, functionArgs } =
      await responseParser.parseFunctionUsage(response)

    expect(functionName).toBe('mockFunction')
    expect(functionArgs).toEqual({ param1: 'value1', param2: 42, param3: true })
  })
})
