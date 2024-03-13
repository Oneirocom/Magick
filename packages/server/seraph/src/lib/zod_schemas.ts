// zod_schemas.ts
import { z } from 'zod'

/**
 * Defines the schema for a cognitive function.
 */
const CognitiveFunctionSchema = z
  .object({
    name: z.string(),
    description: z.string(),
    parameters: z.record(z.any()),
    examples: z.array(z.string()),
  })
  .describe('Cognitive Function Schema')

type CognitiveFunctionSchema = z.infer<typeof CognitiveFunctionSchema>

/**
 * Converts a JSON Schema to the desired XML format for tool usage documentation.
 * @param jsonSchema The JSON Schema to convert.
 * @returns The XML representation of the JSON Schema.
 */
function convertToXML(jsonSchema: CognitiveFunctionSchema): string {
  // Convert the JSON Schema to the desired XML format
  const xmlString = `
    <tool_description>
      <tool_name>${jsonSchema.name}</tool_name>
      <description>${jsonSchema.description}</description>
      <parameters>
        ${Object.entries(jsonSchema.parameters)
          .map(
            ([name, schema]: [string, any]) => `
            <parameter>
              <name>${name}</name>
              <type>${
                Array.isArray(schema.type)
                  ? schema.type.join(' | ')
                  : schema.type
              }</type>
              <description>${schema.description || ''}</description>
            </parameter>
          `
          )
          .join('')}
      </parameters>
    </tool_description>
  `

  return xmlString
}

export { CognitiveFunctionSchema, convertToXML }
