import { NodeCategory, NodeSpecJSON } from '@magickml/behave-graph'
import { XYPosition } from '@xyflow/react'
import { SpellInterfaceWithGraph } from '@magickml/agent-server-schemas'

export type NodePickerFilters = {
  handleType: 'source' | 'target'
  valueType: string
}

export type ItemType = {
  title: string
  type?: string
  subItems: (ItemType | NodeSpecJSON)[]
  category?: NodeCategory
}

export type NodePickerProps = {
  pickedNodePosition: XYPosition | undefined
  position: XYPosition
  filters?: NodePickerFilters
  onPickNode: (
    type: string,
    position: XYPosition,
    nodeSpec?: NodeSpecJSON
  ) => void
  onClose: () => void
  specJSON: NodeSpecJSON[] | undefined
  spell: SpellInterfaceWithGraph
}
