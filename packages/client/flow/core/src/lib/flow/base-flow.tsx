'use client'
import React, { useCallback, useEffect, useMemo } from 'react'
import {
  Background,
  BackgroundVariant,
  ReactFlow,
  MiniMap,
  ReactFlowInstance,
} from '@xyflow/react'
import CustomControls from '../controls/Controls'
import { NodePicker } from '../node-picker/NodePicker'
import { type BehaveGraphFlow, useFlowHandlers } from '../hooks'
import { Tab, usePubSub } from '@magickml/providers'
import { SpellInterfaceWithGraph } from '@magickml/agent-server-schemas'
import { RootState } from 'client/state'
import { nodeColor } from '../utils/nodeColor'
import { ContextNodeMenu } from '../controls/context-node-menu'
import CustomEdge from '../node/custom-edge'
import { NodeSpecJSON } from '@magickml/behave-graph'
import { CommentNode } from '../nodeTypes/comment'
import { MagickEdgeType, MagickNodeType } from '@magickml/client-types'
import { NodeGrouping } from '../components/nodeGroups'
import { GroupNodeComponent } from '../nodeTypes/group'

export type MagickReactFlowInstance = ReactFlowInstance<
  MagickNodeType,
  MagickEdgeType
>

type BaseFlowHandlers = Pick<
  ReturnType<typeof useFlowHandlers>,
  | 'handleOnConnect'
  | 'handleStartConnect'
  | 'handleStopConnect'
  | 'handlePaneClick'
  | 'handlePaneContextMenu'
  | 'nodePickerPosition'
  | 'pickedNodeVisibility'
  | 'handleAddNode'
  | 'closeNodePicker'
  | 'nodePickFilters'
  | 'nodeMenuVisibility'
  | 'handleNodeContextMenu'
  | 'openNodeMenu'
  | 'setOpenNodeMenu'
  | 'nodeMenuActions'
  | 'isValidConnectionHandler'
  | 'onEdgeUpdate'
  | 'socketsVisible'
  | 'toggleSocketVisibility'
  | 'handleSelectionDragStart'
  | 'handleDelete'
  | 'handleNodeDragStart'
  | 'handleNodeDrag'
  | 'handleDrop'
  | 'onDragOver'
  | 'handleNodeDragStop'
>

type BaseFlowBehaveGraphFlow = Pick<
  BehaveGraphFlow,
  | 'setGraphJson'
  | 'onNodesChange'
  | 'onEdgesChange'
  | 'nodeTypes'
  | 'nodes'
  | 'edges'
>

type BaseFlowProps = {
  spell: SpellInterfaceWithGraph
  parentRef: React.RefObject<HTMLDivElement>
  tab: Tab
  readOnly?: boolean
  specJSON: NodeSpecJSON[]
  windowDimensions: { width: number; height: number }
  behaveGraphFlow: BaseFlowBehaveGraphFlow
  flowHandlers: BaseFlowHandlers
  pubSub?: ReturnType<typeof usePubSub> // should split this into separate handler props
  globalConfig?: RootState['globalConfig'] | undefined // could split this into projectId and currentAgentId
  lastStateEvent?: any
}

const edgeTypes = {
  'custom-edge': CustomEdge,
}

const proOptions = {
  // passing in the account property will enable hiding the attribution
  // for versions < 10.2 you can use account: 'paid-enterprise'
  account: 'paid-pro',
  // in combination with the account property, hideAttribution: true will remove the attribution
  hideAttribution: true,
}

function isEmptyObject(obj: object): boolean {
  return Object.keys(obj).length === 0
}

export const BaseFlow: React.FC<BaseFlowProps> = ({
  spell,
  tab,
  specJSON,
  readOnly = false,
  behaveGraphFlow,
  flowHandlers,
  pubSub,
  globalConfig,
  lastStateEvent,
}) => {
  const {
    setGraphJson,
    onNodesChange,
    onEdgesChange,
    nodeTypes: behaveNodeTypes,
    nodes,
    edges,
  } = behaveGraphFlow

  // memoize node types
  const nodeTypes = useMemo(() => {
    if (!behaveNodeTypes) return {}
    return {
      ...behaveNodeTypes,
      comment: CommentNode,
      group: GroupNodeComponent,
    }
  }, [behaveNodeTypes])

  const { projectId, currentAgentId } = globalConfig || {}
  const { publish, events } = pubSub || {}
  const [isDebug, setIsDebug] = React.useState(false)
  const [miniMapOpen, setMiniMapOpen] = React.useState(false)

  useEffect(() => {
    if (!lastStateEvent || lastStateEvent.spellId !== spell.id) return
    if (!lastStateEvent.state) return
    setIsDebug(lastStateEvent.state.debug)
  }, [lastStateEvent])

  const {
    handleOnConnect,
    handleStartConnect,
    handleStopConnect,
    handlePaneClick,
    handlePaneContextMenu,
    nodePickerPosition,
    pickedNodeVisibility,
    handleAddNode,
    closeNodePicker,
    nodePickFilters,
    nodeMenuVisibility,
    handleNodeContextMenu,
    openNodeMenu,
    setOpenNodeMenu,
    nodeMenuActions,
    isValidConnectionHandler,
    onEdgeUpdate,
    handleNodeDragStart,
    handleDelete,
    handleSelectionDragStart,
    handleNodeDrag,
    handleDrop,
    onDragOver,
    handleNodeDragStop,
  } = flowHandlers

  const toggleDebug = useCallback(() => {
    console.log({ publish, events, currentAgentId, agentId: currentAgentId })

    if (!publish || !events || !currentAgentId) return
    const newState = !isDebug

    publish(events.SEND_COMMAND, {
      projectId,
      agentId: currentAgentId,
      command: 'agent:spellbook:toggleDebug',
      data: {
        spellId: spell.id,
        debug: newState,
      },
    })

    setIsDebug(newState)
  }, [isDebug, publish, events, currentAgentId])

  if (!nodeTypes || isEmptyObject(nodeTypes)) return null

  return (
    <ReactFlow<MagickNodeType, MagickEdgeType>
      proOptions={proOptions}
      nodeTypes={nodeTypes}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange(tab.id)}
      onEdgesChange={onEdgesChange(tab.id)}
      nodesDraggable={!readOnly}
      nodesConnectable={!readOnly}
      elementsSelectable={!readOnly}
      onConnect={handleOnConnect}
      onNodeDragStart={handleNodeDragStart}
      onNodeDragStop={handleNodeDragStop}
      onNodeDrag={handleNodeDrag}
      onDrop={handleDrop}
      onDragOver={onDragOver}
      onSelectionDragStart={handleSelectionDragStart}
      onDelete={handleDelete}
      edgeTypes={edgeTypes}
      isValidConnection={isValidConnectionHandler}
      onEdgeUpdate={onEdgeUpdate}
      onConnectStart={handleStartConnect}
      onConnectEnd={handleStopConnect}
      elevateEdgesOnSelect={true}
      fitView
      fitViewOptions={{ maxZoom: 2, minZoom: 0.1 }}
      minZoom={0.05}
      onPaneClick={handlePaneClick}
      onPaneContextMenu={handlePaneContextMenu}
      onNodeContextMenu={handleNodeContextMenu}
    >
      <CustomControls
        setBehaviorGraph={setGraphJson}
        specJson={specJSON}
        miniMapOpen={miniMapOpen}
        toggleMiniMap={() => setMiniMapOpen(!miniMapOpen)}
        toggleDebug={toggleDebug}
        isDebug={isDebug}
      />
      <Background
        variant={BackgroundVariant.Lines}
        patternClassName="color-[var(--background-color-light)]"
        color="var(--background-color-light)"
        style={{ backgroundColor: 'var(--background-color)' }}
      />
      <NodeGrouping />
      {miniMapOpen && (
        <MiniMap<MagickNodeType>
          nodeStrokeWidth={3}
          maskColor="#69696930"
          nodeColor={node => nodeColor(node, specJSON)}
          pannable
          zoomable
        />
      )}
      {nodePickerPosition && !readOnly && (
        <NodePicker
          position={nodePickerPosition}
          pickedNodePosition={pickedNodeVisibility}
          filters={nodePickFilters}
          onPickNode={handleAddNode}
          onClose={closeNodePicker}
          specJSON={specJSON}
          spell={spell}
        />
      )}

      {openNodeMenu && (
        <ContextNodeMenu
          position={nodeMenuVisibility}
          isOpen={openNodeMenu}
          onClose={() => setOpenNodeMenu(false)}
          actions={nodeMenuActions}
        />
      )}
    </ReactFlow>
  )
}
