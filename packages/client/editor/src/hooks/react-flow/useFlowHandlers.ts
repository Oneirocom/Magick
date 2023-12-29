import { NodeSpecJSON } from '@magickml/behave-graph'
import {
  MouseEvent as ReactMouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  Node,
  OnConnectStartParams,
  XYPosition,
  useStore,
  NodeChange,
  useReactFlow,
} from 'reactflow'
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
  const [targetNodes, setTargetNodes] = useState<Node[] | undefined>(undefined)
  const rfDomNode = useStore(state => state.domNode)
  const mousePosRef = useRef<XYPosition>({ x: 0, y: 0 })
  const { screenToFlowPosition, getNodes } = useReactFlow()

  useEffect(() => {
    if (rfDomNode) {
      const onMouseMove = (event: MouseEvent) => {
        mousePosRef.current = {
          x: event.clientX,
          y: event.clientY,
        }
      }

      rfDomNode.addEventListener('mousemove', onMouseMove)

      return () => {
        rfDomNode.removeEventListener('mousemove', onMouseMove)
      }
    }
  }, [rfDomNode])

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
    if (!targetNodes.length) return
    const newNodes: NodeChange[] = targetNodes.map(node => {
      return { id: node.id, type: 'remove' }
    })
    onNodesChange(tab.id)(newNodes)
    setTargetNodes(undefined)
  }

  const cloneNode = () => {
    if (!targetNodes.length) return
    const newNodes: NodeChange[] = targetNodes.map(node => {
      const id = uuidv4()
      const x = node.position.x + 10
      const y = node.position.y + 10

      return { item: { ...node, id, position: { x, y } }, type: 'add' }
    })

    onNodesChange(tab.id)(newNodes)
    setTargetNodes(undefined)
  }

  const copy = useCallback(() => {
    const selectedNodes = getNodes().filter(node => node.selected)
    if (!selectedNodes.length) return
    localStorage.setItem('copiedNodes', JSON.stringify(selectedNodes))
    setTargetNodes(undefined)
  }, [nodes])

  const handleStartConnect = useCallback(
    (e: ReactMouseEvent, params: OnConnectStartParams) => {
      setLastConnectStart(params)
    },
    [getNodes]
  )

  const paste = useCallback(() => {
    const copiedNodes = localStorage.getItem('copiedNodes')
    if (!copiedNodes) return

    const { x: pasteX, y: pasteY } = screenToFlowPosition({
      x: mousePosRef.current.x,
      y: mousePosRef.current.y,
    })

    const bufferedNodes = JSON.parse(copiedNodes) as Node[]
    const minX = Math.min(...bufferedNodes.map(node => node.position.x))
    const minY = Math.min(...bufferedNodes.map(node => node.position.y))

    const newNodes: NodeChange[] = bufferedNodes.map(node => {
      const id = uuidv4()
      const x = pasteX + (node.position.x - minX)
      const y = pasteY + (node.position.y - minY)

      return { item: { ...node, id, position: { x, y } }, type: 'add' }
    })

    onNodesChange(tab.id)(newNodes)
    localStorage.removeItem('copiedNodes')
  }, [screenToFlowPosition, onNodesChange, tab])

  const nodeMenuActions = [
    { label: 'Delete', onClick: handleRemoveNode },
    { label: 'Clone', onClick: cloneNode },
    { label: 'Copy', onClick: copy },
    { label: 'Paste', onClick: paste },
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
      const selectedNodes = getNodes().filter(node => node.selected)
      e.preventDefault()
      e.stopPropagation()

      setNodeMenuVisibility({
        x: e.clientX,
        y: e.clientY,
      })

      setTargetNodes(selectedNodes)
      setOpenNodeMenu(true)
    },
    []
  )

  //  COPY and PASTING WITH HOTKEYS IS NOT WORKING AS EXPECTED FOR THE UNKNOWN REASON
  // useHotkeys('meta+c, ctrl+c', copy)
  // useHotkeys('meta+v, ctrl+v', paste)

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
