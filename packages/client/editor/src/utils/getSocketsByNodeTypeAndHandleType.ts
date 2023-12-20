import { NodeSpecJSON } from '@magickml/behave-graph'

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

  // Extracting sockets from configuration
  const configSockets =
    handleType === 'source'
      ? configuration.socketOutputs
      : configuration.socketInputs

  // Merging sockets from nodeSpec and configuration (if they exist)
  const mergedSockets = [...(mainSockets || []), ...(configSockets || [])]

  return mergedSockets
}
