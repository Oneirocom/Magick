// DOCUMENTED 
/**
 * Represents the Langchain plugin for the MagickML engine.
 * @class
 */
import { ClientPlugin } from '@magickml/core'
import Nodes from '@magickml/plugin-langchain-shared'


const LangchainPlugin = new ClientPlugin({
  name: 'LangchainPlugin',
  nodes: Nodes,
  secrets: [],
})

export default LangchainPlugin
