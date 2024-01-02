import React from 'react';
import { Background, BackgroundVariant, ReactFlow, MiniMap } from 'reactflow';

import CustomControls from './Controls.js'
import { NodePicker } from './NodePicker.js'
import { useBehaveGraphFlow } from '../../hooks/react-flow/useBehaveGraphFlow.js'
import { useFlowHandlers } from '../../hooks/react-flow/useFlowHandlers.js'
import { Tab, usePubSub } from '@magickml/providers'

import './flowOverrides.css'
import { SpellInterface } from 'server/schemas'
import { getNodeSpec } from 'shared/nodeSpec'
import { useSelector } from 'react-redux'
import { RootState } from 'client/state'
import { nodeColor } from '../../utils/nodeColor.js'
import { ContextNodeMenu } from './ContextNodeMenu'

type FlowProps = {
  spell: SpellInterface;
  parentRef: React.RefObject<HTMLDivElement>;
  tab: Tab
}

export const Flow: React.FC<FlowProps> = ({ spell, parentRef, tab }) => {
  const specJson = getNodeSpec()
  const globalConfig = useSelector((state: RootState) => state.globalConfig)
  const { projectId, currentAgentId } = globalConfig
  const { publish, events } = usePubSub()

  const [playing, setPlaying] = React.useState(false)
  const [miniMapOpen, setMiniMapOpen] = React.useState(false)

  const { SEND_COMMAND } = events

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    setGraphJson,
    nodeTypes,
    onConnect,
  } = useBehaveGraphFlow({
    spell,
    specJson,
    tab,
  })

  const {
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
    nodeMenuActions
  } = useFlowHandlers({
    nodes,
    onEdgesChange,
    onNodesChange,
    specJSON: specJson,
    parentRef,
    tab,
  })

  const togglePlay = () => {
    if (playing) {
      publish(SEND_COMMAND, {
        projectId,
        agentId: currentAgentId,
        command: 'agent:core:pauseSpell',
        data: {
          spellId: spell.id,
        },
      })
    } else {
      publish(SEND_COMMAND, {
        projectId,
        agentId: currentAgentId,
        command: 'agent:core:playSpell',
        data: {
          spellId: spell.id,
        },
      })
    }
    setPlaying(!playing)
  }

  return (
    <ReactFlow
      nodeTypes={nodeTypes}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange(tab.id)}
      onEdgesChange={onEdgesChange(tab.id)}
      onConnect={onConnect(tab.id)}
      onConnectStart={handleStartConnect}
      onConnectEnd={handleStopConnect}
      fitView
      fitViewOptions={{ maxZoom: 2, minZoom: 0.1 }}
      minZoom={0.1}
      onPaneClick={handlePaneClick}
      onPaneContextMenu={handlePaneContextMenu}
      onNodeContextMenu={handleNodeContextMenu}
    >
      <CustomControls
        playing={playing}
        togglePlay={togglePlay}
        setBehaviorGraph={setGraphJson}
        specJson={specJson}
        miniMapOpen={miniMapOpen}
        toggleMiniMap={() => setMiniMapOpen(!miniMapOpen)}
      />
      <Background
        variant={BackgroundVariant.Lines}
        color="var(--background-color)"
        style={{ backgroundColor: 'var(--deep-background-color)' }}
      />
      {miniMapOpen && (
        <MiniMap
          nodeStrokeWidth={3}
          maskColor="#69696930"
          nodeColor={node => nodeColor(node, specJson)}
          pannable
          zoomable
        />
      )}
      {nodePickerPosition && (
        <NodePicker
          position={nodePickerPosition}
          pickedNodePosition={pickedNodeVisibility}
          filters={nodePickFilters}
          onPickNode={handleAddNode}
          onClose={closeNodePicker}
          specJSON={specJson}
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
