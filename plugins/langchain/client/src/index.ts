// DOCUMENTED 
/**
 * Represents the Langchain plugin for the MagickML engine.
 * @class
 */
import { ClientPlugin } from '@magickml/core'
import { getNodes } from '@magickml/plugin-langchain-shared'

const LangchainPlugin = new ClientPlugin({
  name: 'LangchainPlugin',
  nodes: getNodes(),
  secrets: [],
})

export default LangchainPlugin
