import { NodeSpecJSON } from '@magickml/behave-graph'
import {
  MouseEvent as ReactMouseEvent,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { Node, OnConnectStartParams, XYPosition } from 'reactflow'
import { v4 as uuidv4 } from 'uuid'

import { calculateNewEdge } from '../../utils/calculateNewEdge.js'
import { getNodePickerFilters } from '../../utils/getPickerFilters.js'
import { useBehaveGraphFlow } from './useBehaveGraphFlow.js'
import { Tab } from '@magickml/providers'

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
  tab,
}: Pick<BehaveGraphFlow, 'onEdgesChange' | 'onNodesChange'> & {
  nodes: Node[]
  specJSON: NodeSpecJSON[] | undefined
  parentRef: React.RefObject<HTMLDivElement>
  tab: Tab
}) => {
  const [lastConnectStart, setLastConnectStart] =
    useState<OnConnectStartParams>()
  const [nodePickerVisibility, setNodePickerVisibility] = useState<XYPosition>()
  const [nodeMenuVisibility, setNodeMenuVisibility] = useState<XYPosition>()
  const [openNodeMenu, setOpenNodeMenu] = useState(false)
  const [targetNode, setTargetNode] = useState<Node | undefined>(undefined)

  const closeNodePicker = useCallback(() => {
    setLastConnectStart(undefined)
    setNodePickerVisibility(undefined)
  }, [])

  let blockClose = false

  const handleAddNode = useCallback(
    (nodeType: string, position: XYPosition) => {
      closeNodePicker()
      const newNode = {
        id: uuidv4(),
        type: nodeType,
        position,
        data: {},
      }
      onNodesChange(tab.id)([
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
      onEdgesChange(tab.id)([
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

  const handleRemoveNode = () => {
    onNodesChange(tab.id)([
      {
        type: 'remove',
        id: targetNode?.id,
      },
    ])
    setTargetNode(undefined)
  }

  const cloneNode = () => {
    if (targetNode === undefined) return
    const newNode = {
      ...targetNode,
      id: uuidv4(),
      position: {
        x: targetNode.position.x + 10,
        y: targetNode.position.y + 10,
      },
    }
    onNodesChange(tab.id)([
      {
        type: 'add',
        item: newNode,
      },
    ])
    setTargetNode(undefined)
  }

  const handleStartConnect = useCallback(
    (e: ReactMouseEvent, params: OnConnectStartParams) => {
      setLastConnectStart(params)
    },
    []
  )

  const nodeMenuActions = [
    { label: 'Delete', onClick: handleRemoveNode },
    { label: 'Clone', onClick: cloneNode },
    { label: 'Copy', onClick: () => {} },
    { label: 'Paste', onClick: () => {} },
  ]

  const handleStopConnect = useCallback((e: MouseEvent) => {
    blockClose = true
    e.preventDefault()
    const element = e.target as HTMLElement
    if (element.classList.contains('react-flow__pane')) {
      const bounds = parentRef.current.getBoundingClientRect()
      setNodePickerVisibility({
        x: e.clientX - bounds.left + window.scrollX,
        y: e.clientY - bounds.top + window.scrollY,
      })

      setTimeout(() => {
        blockClose = false
      }, 500)
    } else {
      setLastConnectStart(undefined)
    }
  }, [])

  const handlePaneClick = useCallback(() => {
    if (blockClose) return
    closeNodePicker()
    setTargetNode(undefined)
  }, [closeNodePicker])

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

  const handleNodeContextMenu = useCallback(
    (e: ReactMouseEvent, node: Node) => {
      e.preventDefault()
      e.stopPropagation()
      setNodeMenuVisibility({
        x: e.clientX,
        y: e.clientY,
      })
      setTargetNode(node)
      setOpenNodeMenu(true)
    },
    []
  )

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
    handleNodeContextMenu,
    nodeMenuVisibility,
    setNodeMenuVisibility,
    setOpenNodeMenu,
    openNodeMenu,
    nodeMenuActions,
  }
}
