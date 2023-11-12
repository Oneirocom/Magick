import { NodeSpecJSON } from '@magickml/behave-graph'
import {
  MouseEvent as ReactMouseEvent,
  useCallback,
  useEffect,
  useState,
} from 'react'
import {
  Connection,
  Node,
  OnConnectStartParams,
  XYPosition,
  useReactFlow,
} from 'reactflow'
import { v4 as uuidv4 } from 'uuid'

import { calculateNewEdge } from '../../utils/calculateNewEdge.js'
import { getNodePickerFilters } from '../../utils/getPickerFilters.js'
import { useBehaveGraphFlow } from './useBehaveGraphFlow.js'

type BehaveGraphFlow = ReturnType<typeof useBehaveGraphFlow>

const useNodePickFilters = ({
  nodes,
  lastConnectStart,
  specJSON,
}: {
  nodes: Node[]
  lastConnectStart: OnConnectStartParams | undefined
  specJSON: NodeSpecJSON[] | undefined
}) => {
  const [nodePickFilters, setNodePickFilters] = useState(
    getNodePickerFilters(nodes, lastConnectStart, specJSON)
  )

  useEffect(() => {
    setNodePickFilters(getNodePickerFilters(nodes, lastConnectStart, specJSON))
  }, [nodes, lastConnectStart, specJSON])

  return nodePickFilters
}

export const useFlowHandlers = ({
  onEdgesChange,
  onNodesChange,
  nodes,
  specJSON,
  parentRef,
}: Pick<BehaveGraphFlow, 'onEdgesChange' | 'onNodesChange'> & {
  nodes: Node[]
  specJSON: NodeSpecJSON[] | undefined
  parentRef: React.RefObject<HTMLDivElement>
}) => {
  const [lastConnectStart, setLastConnectStart] =
    useState<OnConnectStartParams>()
  const [nodePickerVisibility, setNodePickerVisibility] = useState<XYPosition>()

  const closeNodePicker = useCallback(() => {
    setLastConnectStart(undefined)
    setNodePickerVisibility(undefined)
  }, [])

  const handleAddNode = useCallback(
    (nodeType: string, position: XYPosition) => {
      closeNodePicker()
      const newNode = {
        id: uuidv4(),
        type: nodeType,
        position,
        data: {},
      }
      onNodesChange([
        {
          type: 'add',
          item: newNode,
        },
      ])

      if (lastConnectStart === undefined) return

      // add an edge if we started on a socket
      const originNode = nodes.find(node => node.id === lastConnectStart.nodeId)
      if (originNode === undefined) return
      if (!specJSON) return
      onEdgesChange([
        {
          type: 'add',
          item: calculateNewEdge(
            originNode,
            nodeType,
            newNode.id,
            lastConnectStart,
            specJSON
          ),
        },
      ])
    },
    [
      closeNodePicker,
      lastConnectStart,
      nodes,
      onEdgesChange,
      onNodesChange,
      specJSON,
    ]
  )

  const handleStartConnect = useCallback(
    (e: ReactMouseEvent, params: OnConnectStartParams) => {
      setLastConnectStart(params)
    },
    []
  )

  const handleStopConnect = useCallback((e: MouseEvent) => {
    const element = e.target as HTMLElement
    if (element.classList.contains('react-flow__pane')) {
      setNodePickerVisibility({ x: e.clientX, y: e.clientY })
    } else {
      setLastConnectStart(undefined)
    }
  }, [])

  const handlePaneClick = useCallback(
    () => closeNodePicker(),
    [closeNodePicker]
  )

  const handlePaneContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      if (parentRef && parentRef.current) {
        const bounds = parentRef.current.getBoundingClientRect()
        setNodePickerVisibility({
          x: e.clientX - bounds.left + window.scrollX,
          y: e.clientY - bounds.top + window.scrollY,
        })
      }
    },
    [parentRef]
  )

  const nodePickFilters = useNodePickFilters({
    nodes,
    lastConnectStart,
    specJSON,
  })

  return {
    handleStartConnect,
    handleStopConnect,
    handlePaneClick,
    handlePaneContextMenu,
    lastConnectStart,
    nodePickerVisibility,
    handleAddNode,
    closeNodePicker,
    nodePickFilters,
  }
}
