// DOCUMENTED 
/**
 * A plugin used for the Langchain integration with MagickML engine.
 *
 * @param name - the name of the plugin.
 * @param nodes - the nodes used by the plugin.
 */
import { ServerPlugin } from "@magickml/core"
import Nodes from '@magickml/plugin-langchain-shared'

const LangchainPlugin = new ServerPlugin({
  name: 'LangchainPlugin',
  nodes: Nodes,
  secrets: [],
});

export default LangchainPlugin;