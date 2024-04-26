import { InputSocketSpecJSON, NodeSpecJSON } from '@magickml/behave-graph'
import { socketsFromNumInputs } from './socketsFromNum'
import { getConfigFromNodeSpec } from './getNodeConfig'
import { Connection, Node } from 'reactflow'

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
  spec: NodeSpecJSON[],
  nodeType: string | undefined,
  handleType: 'source' | 'target' | null,
  configuration: Record<string, any> | undefined = undefined
) => {
  const nodeSpec = spec.find(node => node.type === nodeType)
  if (nodeSpec === undefined) return

  // if a config wasn't passed in, lets try getting it from the node spec
  if (!configuration) {
    configuration = getConfigFromNodeSpec(nodeSpec)
  }

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

export const getTargetSocket = (
  connection: Connection,
  targetNode: Node,
  specJSON: NodeSpecJSON[]
) => {
  const targetSockets = getSocketsByNodeTypeAndHandleType(
    specJSON,
    targetNode.type,
    'target',
    targetNode.data.configuration || {}
  )

  const targetSocket = targetSockets?.find(
    socket => socket.name === connection.targetHandle
  )

  return targetSocket
}

export const getSourceSocket = (
  connection: Connection,
  sourceNode: Node,
  specJSON: NodeSpecJSON[]
) => {
  const sourceSockets = getSocketsByNodeTypeAndHandleType(
    specJSON,
    sourceNode.type,
    'source',
    sourceNode.data.configuration || {}
  )

  const sourceSocket = sourceSockets?.find(
    socket => socket.name === connection.sourceHandle
  )

  return sourceSocket as InputSocketSpecJSON
}
