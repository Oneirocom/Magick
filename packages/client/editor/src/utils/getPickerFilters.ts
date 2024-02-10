import { NodeSpecJSON } from '@magickml/behave-graph'
import { Node, OnConnectStartParams } from 'reactflow'

import { getSocketsByNodeTypeAndHandleType } from './getSocketsByNodeTypeAndHandleType'
import { NodePickerFilters } from '../components/react-flow/NodePicker'

export const getNodePickerFilters = (
  nodes: Node[],
  params: OnConnectStartParams | undefined,
  specJSON: NodeSpecJSON[] | undefined
): NodePickerFilters | undefined => {
  if (params === undefined) return

  const originNode = nodes.find(node => node.id === params.nodeId)
  if (originNode === undefined) return

  const sockets = specJSON
    ? getSocketsByNodeTypeAndHandleType(
        specJSON,
        originNode.type,
        params.handleType,
        originNode.data.configuration || {}
      )
    : undefined

  const socket = sockets?.find(socket => socket.name === params.handleId)

  if (socket === undefined) return

  return {
    handleType: params.handleType === 'source' ? 'target' : 'source',
    valueType: socket.valueType,
  }
}
