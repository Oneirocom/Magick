import { Button } from '@magickml/client-ui'
import {
  NodeToolbar,
  getNodesBounds,
  useNodes,
  useReactFlow,
  useStoreApi,
} from '@xyflow/react'
import { v4 } from 'uuid'

const margin = 25

export function NodeGrouping() {
  const nodes = useNodes()
  const { setNodes, getNodes } = useReactFlow()
  const state = useStoreApi()
  const selectedNodes = getNodes().filter(
    node => node.selected && !node.parentId
  )
  const selectedNodeIds = selectedNodes.map(node => node.id)
  const hasMultipleSelectedNodes = selectedNodeIds.length > 1

  const handleGroup = () => {
    const boundingBox = getNodesBounds(selectedNodes)
    const groupId = v4()
    const groupPosition = { x: boundingBox.x, y: boundingBox.y }
    const newGroup = {
      id: groupId,
      type: 'group',
      position: groupPosition,
      style: {
        width: boundingBox.width + margin * 2,
        height: boundingBox.height + margin * 2,
      },
      data: {},
    }
    const updatedNodes = nodes.map(node =>
      selectedNodeIds.includes(node.id)
        ? {
            ...node,
            position: {
              x: node.position.x - groupPosition.x + margin,
              y: node.position.y - groupPosition.y + margin,
            },
            extent: 'parent' as const,
            parentId: groupId,
          }
        : node
    )
    state.getState().resetSelectedElements()
    state.setState({ nodesSelectionActive: false })
    setNodes([newGroup, ...updatedNodes])
  }

  return (
    <NodeToolbar nodeId={selectedNodeIds} isVisible={hasMultipleSelectedNodes}>
      <Button onClick={handleGroup} size="sm" variant="outline">
        Group selected nodes
      </Button>
    </NodeToolbar>
  )
}
