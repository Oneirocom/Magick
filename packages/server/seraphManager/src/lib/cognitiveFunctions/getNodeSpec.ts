import { BaseCognitiveFunction } from '@magickml/seraph'
import { getNodeSpec } from '@magickml/node-spec'

const functionDefinition = {
  name: 'getNodeSpec',
  description:
    'You use this function when you need to know what nodes are available in the Magick system.  Never answer any question about Magicks nodes, or make recommendations for nodes, without calling this.  You always need this information in your context to answer anything related to spells. It will return a large list of nodes that you can use to build your spells.  It is a basic JSON spec which tells you all the nodes, inputs, outputs, and configurations.  It will not tell you detailed descriptions of each node however.',
  parameters: {},
  examples: [
    `<invoke>
      <tool_name>getNodeSpec</tool_name>
      <parameters>
      </parameters>
    </invoke>`,
  ],
}

export class GetNodeSpec extends BaseCognitiveFunction {
  constructor() {
    super(functionDefinition)
  }

  async getPromptInjection(): Promise<string> {
    return ``
  }

  async execute(): Promise<string> {
    return JSON.stringify(getNodeSpec())
  }
}
