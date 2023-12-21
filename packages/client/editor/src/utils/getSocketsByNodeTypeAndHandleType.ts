import { NodeSpecJSON } from '@magickml/behave-graph'
import { socketsFromNumInputs } from './socketsFromNum'

// export const getSocketsByNodeTypeAndHandleType = (
//   nodes: NodeSpecJSON[],
//   nodeType: string | undefined,
//   handleType: 'source' | 'target' | null,
//   configuration: Record<string, any> = {},
// ) => {
//   const nodeSpec = nodes.find((node) => node.type === nodeType);
//   if (nodeSpec === undefined) return;
//   return handleType === 'source' ? nodeSpec.outputs : nodeSpec.inputs;
// };

export const getSocketsByNodeTypeAndHandleType = (
  nodes: NodeSpecJSON[],
  nodeType: string | undefined,
  handleType: 'source' | 'target' | null,
  configuration: Record<string, any> = {}
) => {
  const nodeSpec = nodes.find(node => node.type === nodeType)
  if (nodeSpec === undefined) return

  // Extracting sockets from nodeSpec based on handleType
  const mainSockets =
    handleType === 'source' ? nodeSpec.outputs : nodeSpec.inputs

  const socketInputs = configuration.socketInputs || []
  const socketOutputs = configuration.socketOutputs || []
  const socketNumInputs = socketsFromNumInputs(configuration.numInputs || 0)
  const socketNumOutputs = socketsFromNumInputs(configuration.numOutputs || 0)

  const inputs = [...socketInputs, ...socketNumInputs]
  const outputs = [...socketOutputs, ...socketNumOutputs]

  // Extracting sockets from configuration
  const configSockets = handleType === 'source' ? outputs : inputs

  // Merging sockets from nodeSpec and configuration (if they exist)
  const mergedSockets = [...(mainSockets || []), ...(configSockets || [])]

  return mergedSockets
}
