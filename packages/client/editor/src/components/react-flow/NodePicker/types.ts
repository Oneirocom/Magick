import { NodeSpecJSON } from '@magickml/behave-graph'
import { XYPosition } from 'reactflow'

export type NodePickerFilters = {
  handleType: 'source' | 'target'
  valueType: string
}

export type ItemType = {
  title: string
  type?: string
  subItems: (ItemType | NodeSpecJSON)[]
}

export type NodePickerProps = {
  pickedNodePosition: XYPosition | undefined
  position: XYPosition
  filters?: NodePickerFilters
  onPickNode: (type: string, position: XYPosition) => void
  onClose: () => void
  specJSON: NodeSpecJSON[] | undefined
}
