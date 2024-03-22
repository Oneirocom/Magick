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
  Edge,
  updateEdge,
  Connection,
  OnConnectStart,
  OnConnectEnd,
} from 'reactflow'
import { v4 as uuidv4 } from 'uuid'

import { calculateNewEdge } from '../../utils/calculateNewEdge'
import { getNodePickerFilters } from '../../utils/getPickerFilters'
import { isValidConnection } from '../../utils/isValidConnection'
import { useBehaveGraphFlow } from './useBehaveGraphFlow'
import { Tab } from '@magickml/providers'
import {
  onConnect as onConnectState,
  selectLayoutChangeEvent,
  setEdges,
  setLayoutChangeEvent,
  setNodes,
} from 'client/state'
import { getSourceSocket } from '../../utils/getSocketsByNodeTypeAndHandleType'
import { useDispatch, useSelector } from 'react-redux'

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
  edges,
  specJSON,
  parentRef,
  tab,
}: Pick<BehaveGraphFlow, 'onEdgesChange' | 'onNodesChange'> & {
  nodes: Node[]
  edges: Edge[]
  specJSON: NodeSpecJSON[] | undefined
  parentRef: React.RefObject<HTMLDivElement>
  tab: Tab
}) => {
  const [lastConnectStart, setLastConnectStart] =
    useState<OnConnectStartParams>()
  const [pickedNodeVisibility, setPickedNodeVisibility] = useState<XYPosition>()
  const [nodePickerPosition, setNodePickerPosition] = useState<XYPosition>()
  const [nodeMenuVisibility, setNodeMenuVisibility] = useState<XYPosition>()
  const [openNodeMenu, setOpenNodeMenu] = useState(false)
  const [targetNodes, setTargetNodes] = useState<Node[] | undefined>(undefined)
  const rfDomNode = useStore(state => state.domNode)
  const mousePosRef = useRef<XYPosition>({ x: 0, y: 0 })
  const instance = useReactFlow()
  const { screenToFlowPosition, getNodes } = instance
  const layoutChangeEvent = useSelector(selectLayoutChangeEvent)
  const dispatch = useDispatch()

  useEffect(() => {
    if (layoutChangeEvent) {
      closeNodePicker()
    } else {
      dispatch(setLayoutChangeEvent(false))
    }
  }, [layoutChangeEvent])

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
    setNodePickerPosition(undefined)
    setPickedNodeVisibility(undefined)
  }, [])

  const onEdgeUpdate = useCallback(
    (oldEdge, newConnection) => {
      console.log('onEdgeUpdate', oldEdge, newConnection)
      return setEdges(tab.id, edges => {
        const newEdges = updateEdge(oldEdge, newConnection, edges)
        return newEdges
      })
    },
    [nodes, instance]
  )

  const handleOnConnect = useCallback(
    (_connection: Connection) => {
      const connection = {
        ..._connection,
        type: 'custom-edge',
        updatable: 'target',
      }

      // get source node
      const sourceNode = nodes.find(node => node.id === connection.source)
      const sourceSocket =
        sourceNode &&
        specJSON &&
        getSourceSocket(connection, sourceNode, specJSON)

      // @ts-ignore
      connection.data = {
        valueType: sourceSocket?.valueType,
      }

      // if the source socket is not a flow socket, we don't need to do anything special
      if (sourceSocket === undefined || sourceSocket.valueType !== 'flow') {
        onConnectState(tab.id)(connection)
        return
      }

      const sourceEdge = edges.find(
        edge =>
          edge.source === connection.source &&
          edge.sourceHandle === connection.sourceHandle
      )

      if (sourceEdge) {
        // If we make it here, we know that the source socket is a flow socket
        // We want to remove any existing edges that are connected to the source socket
        // and replace them with the new flow type edge
        onEdgesChange(tab.id)([
          {
            type: 'remove',
            id: sourceEdge.id,
          },
        ])
      }

      onConnectState(tab.id)(connection)
      return
    },
    [tab, nodes, edges]
  )

  const isValidConnectionHandler = useCallback(
    (connection: Connection) => {
      console.log('validating connection')
      const newNode = nodes.find(node => node.id === connection.target)
      if (!newNode || !specJSON) return false
      return isValidConnection(connection, instance, specJSON)
    },
    [instance, nodes, specJSON]
  )

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
    if (!targetNodes?.length) return

    const newNodes = nodes.filter(
      node => !targetNodes.some(targetNode => targetNode.id === node.id)
    )

    const newEdges = edges.filter(
      edge =>
        !targetNodes.some(
          node => node.id === edge.source || node.id === edge.target
        )
    )

    setNodes(tab.id, newNodes)
    setEdges(tab.id, newEdges)
    setTargetNodes(undefined)
  }

  const cloneNode = () => {
    if (!targetNodes?.length) return
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

  const handleStartConnect: OnConnectStart = useCallback(
    (e, params) => {
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

  const handleStopConnect: OnConnectEnd = useCallback(e => {
    blockClose = true
    e.preventDefault()
    const element = e.target as HTMLElement
    if (element.classList.contains('react-flow__pane')) {
      const bounds = parentRef?.current?.getBoundingClientRect()

      if (!bounds) return

      let clientX, clientY

      if (e instanceof MouseEvent) {
        clientX = e.clientX
        clientY = e.clientY
      } else if (e instanceof TouchEvent && e.touches.length > 0) {
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
      }

      setPickedNodeVisibility({
        x: clientX - bounds.left + window.scrollX,
        y: clientY - bounds.top + window.scrollY,
      })
      setNodePickerPosition({
        x: clientX,
        y: clientY,
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

        const nodePickerWidth = 440
        const nodePickerHeight = 251

        // Calculate positions, ensuring the node picker doesn't open off-screen
        let xPosition = e.clientX - bounds.left
        let yPosition = e.clientY - bounds.top

        // Adjust if opening off the right side
        if (e.clientX + nodePickerWidth > window.innerWidth) {
          xPosition -= e.clientX + nodePickerWidth * 1.5 - window.innerWidth
        }

        // Adjust if opening off the bottom
        if (e.clientY + nodePickerHeight > window.innerHeight) {
          yPosition -= e.clientY + nodePickerHeight * 1.1 - window.innerHeight
        }

        setPickedNodeVisibility({
          x: xPosition,
          y: yPosition,
        })
        setNodePickerPosition({
          x: xPosition + bounds.left,
          y: yPosition + bounds.top,
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
      if (lastConnectStart) return

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
    handleOnConnect,
    onEdgeUpdate,
    isValidConnectionHandler,
    handleStartConnect,
    handleStopConnect,
    handlePaneClick,
    handlePaneContextMenu,
    lastConnectStart,
    nodePickerPosition,
    pickedNodeVisibility,
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
