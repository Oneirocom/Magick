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
  useOnViewportChange,
} from 'reactflow'
import { v4 as uuidv4 } from 'uuid'

import { calculateNewEdge } from '../utils/calculateNewEdge'
import { getNodePickerFilters } from '../utils/getPickerFilters'
import { isValidConnection } from '../utils/isValidConnection'
import { useBehaveGraphFlow } from './useBehaveGraphFlow'
import { Tab } from '@magickml/providers'
import {
  onConnect as onConnectState,
  selectLayoutChangeEvent,
  setEdges,
  setLayoutChangeEvent,
  setNodes,
} from 'client/state'
import { getSourceSocket } from '../utils/getSocketsByNodeTypeAndHandleType'
import { useDispatch, useSelector } from 'react-redux'
import posthog from 'posthog-js'
import { getConfigFromNodeSpec } from '../utils/getNodeConfig'
import { useHotkeys } from 'react-hotkeys-hook'

type BehaveGraphFlow = ReturnType<typeof useBehaveGraphFlow>
type OnEdgeUpdate = (oldEdge: Edge, newConnection: Connection) => void

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
  windowDimensions,
}: Pick<BehaveGraphFlow, 'onEdgesChange' | 'onNodesChange'> & {
  nodes: Node[]
  edges: Edge[]
  specJSON: NodeSpecJSON[] | undefined
  parentRef: React.RefObject<HTMLDivElement>
  tab: Tab
  windowDimensions: { width: number; height: number }
}) => {
  const [lastConnectStart, setLastConnectStart] =
    useState<OnConnectStartParams>()
  const [pickedNodeVisibility, setPickedNodeVisibility] = useState<XYPosition>()
  const [nodePickerPosition, setNodePickerPosition] = useState<XYPosition>()
  const [nodeMenuVisibility, setNodeMenuVisibility] = useState<XYPosition>()
  const [openNodeMenu, setOpenNodeMenu] = useState(false)
  const [blockClose, setBlockClose] = useState(false)
  const [socketsVisible, setSocketsVisible] = useState(true)
  const [targetNodes, setTargetNodes] = useState<Node[] | undefined>(undefined)
  const rfDomNode = useStore(state => state.domNode)
  const [currentKeyPressed, setCurrentKeyPressed] = useState<string | null>(
    null
  )
  const mousePosRef = useRef<XYPosition>({ x: 0, y: 0 })
  const instance = useReactFlow()
  const { screenToFlowPosition, getNodes } = instance
  const layoutChangeEvent = useSelector(selectLayoutChangeEvent)
  const dispatch = useDispatch()

  useHotkeys('meta+c, ctrl+c', () => {
    copy()
  })
  useHotkeys('meta+v, ctrl+v', () => {
    paste()
  })

  useOnViewportChange({
    onStart: () => {
      closeNodePicker()
    },
  })

  useEffect(() => {
    // record current key pressed event
    const onKeyDown = (event: KeyboardEvent) => {
      setCurrentKeyPressed(event.key)
    }
    const onKeyUp = () => {
      setCurrentKeyPressed(null)
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  useEffect(() => {
    if (layoutChangeEvent) {
      closeNodePicker()
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
    if (blockClose) return
    setLastConnectStart(undefined)
    setNodePickerPosition(undefined)
    setPickedNodeVisibility(undefined)
  }, [blockClose])

  const onEdgeUpdate = useCallback<OnEdgeUpdate>(
    (oldEdge, newConnection) => {
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
        updatable: true,
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

      posthog.capture('node_connected', {
        spellId: tab.spellName,
      })

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

  const handleAddComment = useCallback(
    (position: XYPosition) => {
      const newNode = {
        id: uuidv4(),
        type: 'comment',
        position,
        data: {
          text: '',
          cxonfiguration: {},
        },
      }
      onNodesChange(tab.id)([
        {
          type: 'add',
          item: newNode,
        },
      ])
    },
    [closeNodePicker, onNodesChange, tab.id]
  )

  const handleAddNode = useCallback(
    (nodeType: string, position: XYPosition) => {
      closeNodePicker()
      // handle add configuration here so we don't need to do it in the node.
      const nodeSpec = specJSON?.find(spec => spec.type === nodeType)
      console.log('nodeSpec', nodeSpec)
      const newNode = {
        id: uuidv4(),
        type: nodeType,
        position,
        data: {
          configuration: nodeSpec ? getConfigFromNodeSpec(nodeSpec) : {},
        },
      }
      onNodesChange(tab.id)([
        {
          type: 'add',
          item: newNode,
        },
      ])

      posthog.capture('node_added', {
        nodeType,
      })

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
    const selectedEdges = edges.filter(edge =>
      selectedNodes.some(
        node => node.id === edge.source || node.id === edge.target
      )
    )

    if (!selectedNodes.length) return
    localStorage.setItem(
      'copiedNodes',
      JSON.stringify({
        nodes: selectedNodes,
        edges: selectedEdges,
      })
    )
    setTargetNodes(undefined)
  }, [nodes])

  const handleStartConnect: OnConnectStart = useCallback(
    (e, params) => {
      setLastConnectStart(params)
    },
    [getNodes]
  )

  const paste = useCallback(() => {
    console.log('pasting')
    const copiedNodes = localStorage.getItem('copiedNodes')
    if (!copiedNodes) return

    const { nodes, edges } = JSON.parse(copiedNodes)
    const { x: pasteX, y: pasteY } = screenToFlowPosition({
      x: mousePosRef.current.x,
      y: mousePosRef.current.y,
    })

    const bufferedNodes = nodes as Node[]
    const minX = Math.min(...bufferedNodes.map(node => node.position.x))
    const minY = Math.min(...bufferedNodes.map(node => node.position.y))

    const oldToNewIdMap: Record<string, string> = {}

    const newNodes: NodeChange[] = bufferedNodes.map(node => {
      const id = uuidv4()
      const x = pasteX + (node.position.x - minX)
      const y = pasteY + (node.position.y - minY)
      oldToNewIdMap[node.id] = id
      return {
        item: { ...node, id, position: { x, y } },
        type: 'add',
      }
    })

    const newEdges = edges.map((edge: Edge) => ({
      type: 'add',
      item: {
        ...edge,
        id: uuidv4(),
        source: oldToNewIdMap[edge.source],
        target: oldToNewIdMap[edge.target],
      },
    }))

    onNodesChange(tab.id)(newNodes)
    onEdgesChange(tab.id)(newEdges)
  }, [screenToFlowPosition, onNodesChange, tab])

  const nodeMenuActions = [
    { label: 'Delete', onClick: handleRemoveNode },
    { label: 'Clone', onClick: cloneNode },
    { label: 'Copy', onClick: copy },
    { label: 'Paste', onClick: paste },
  ]

  const handleStopConnect: OnConnectEnd = useCallback(
    e => {
      setBlockClose(true)
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

        const nodePickerWidth = 240 // Set the fixed width of the node picker
        const nodePickerHeight = 251 // Set the fixed height of the node picker

        // Calculate initial positions relative to the parent container
        let xPosition = clientX - bounds.left
        let yPosition = clientY - bounds.top

        // Adjust if the node picker would open off the right side of the viewport
        if (xPosition + nodePickerWidth > bounds.width) {
          xPosition = bounds.width - nodePickerWidth
        }

        // Adjust if the node picker would open off the bottom of the viewport
        if (yPosition + nodePickerHeight > bounds.height) {
          yPosition = bounds.height - nodePickerHeight
        }

        // Ensure the node picker stays within the visible area of the viewport
        xPosition = Math.max(
          0,
          Math.min(xPosition, window.innerWidth - nodePickerWidth)
        )
        yPosition = Math.max(
          0,
          Math.min(yPosition, window.innerHeight - nodePickerHeight)
        )

        setPickedNodeVisibility({
          x: xPosition,
          y: yPosition,
        })

        if (!currentKeyPressed) {
          setNodePickerPosition({
            x: xPosition + bounds.left,
            y: yPosition + bounds.top,
          })
        }

        setTimeout(() => {
          setBlockClose(false)
        }, 500)
      } else {
        setLastConnectStart(undefined)
      }
    },
    [parentRef, currentKeyPressed]
  )

  const nodeCreator = (event, keyPressed) => {
    switch (keyPressed) {
      case 'b':
        handleAddNode(
          'flow/branch',
          screenToFlowPosition({ x: event.clientX, y: event.clientY })
        )
        break
      case 'g':
        handleAddNode(
          'magick/generateText',
          screenToFlowPosition({ x: event.clientX, y: event.clientY })
        )
        break
      case 'a':
        handleAddNode(
          'action/memory/addMemory',
          screenToFlowPosition({ x: event.clientX, y: event.clientY })
        )
        break
      case 'c':
        handleAddComment(
          screenToFlowPosition({ x: event.clientX, y: event.clientY })
        )
        break
      default:
        return false
    }
    setLastConnectStart(undefined)
    return true
  }

  const handlePaneClick = useCallback(
    e => {
      const created = nodeCreator(e, currentKeyPressed)

      if (created && blockClose) return

      closeNodePicker()
    },
    [closeNodePicker, currentKeyPressed, blockClose]
  )

  const handlePaneContextMenu = useCallback(
    (mouseClick: React.MouseEvent) => {
      mouseClick.preventDefault()
      if (parentRef && parentRef.current) {
        const bounds = parentRef.current.getBoundingClientRect()

        const nodePickerWidth = 240
        const nodePickerHeight = 251

        // Calculate initial positions, ensuring the node picker doesn't open off-screen initially
        let xPosition = mouseClick.clientX - bounds.left
        let yPosition = mouseClick.clientY - bounds.top

        // Adjust if the context menu would open off the right side of the viewport
        if (xPosition + nodePickerWidth > bounds.width) {
          xPosition = bounds.width - nodePickerWidth * 1.05
        }

        // Adjust if the context menu would open off the bottom of the viewport
        if (yPosition + nodePickerHeight > bounds.height) {
          yPosition = bounds.height - nodePickerHeight * 1.05
        }

        setPickedNodeVisibility({
          x: Math.max(0, xPosition), // Prevent negative values
          y: Math.max(0, yPosition), // Prevent negative values
        })
        setNodePickerPosition({
          x: Math.max(0, xPosition + bounds.left), // Use Math.max to ensure we don't position off-screen
          y: Math.max(0, yPosition + bounds.top), // Use Math.max to ensure we don't position off-screen
        })
      }
    },
    [parentRef, windowDimensions]
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

  const toggleSocketVisibility = useCallback(() => {
    const newState = !socketsVisible
    setSocketsVisible(newState)

    const updatedNodes = nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        socketsVisible: newState,
      },
    })) as Node[]

    setNodes(tab.id, updatedNodes)

    // onNodesChange(tab.id)(updatedNodes)
  }, [socketsVisible, nodes, setNodes])

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
    handleAddComment,
    toggleSocketVisibility,
    socketsVisible,
  }
}
