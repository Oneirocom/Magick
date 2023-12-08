import { IRegistry } from '@magickml/behave-graph';
import React from 'react';
import { Background, BackgroundVariant, ReactFlow, MiniMap } from 'reactflow';

import CustomControls from './Controls.js';
import { NodePicker } from './NodePicker.js';
import { useBehaveGraphFlow } from '../../hooks/react-flow/useBehaveGraphFlow.js';
import { useFlowHandlers } from '../../hooks/react-flow/useFlowHandlers.js';
import { Tab, useConfig, usePubSub } from '@magickml/providers';

import './flowOverrides.css'
import { SpellInterface } from 'server/schemas';
import { getNodeSpec } from 'shared/nodeSpec';
import { useSelector } from 'react-redux';
import { RootState } from 'client/state';

type FlowProps = {
  spell: SpellInterface;
  registry: IRegistry;
  parentRef: React.RefObject<HTMLDivElement>;
  tab: Tab
};

export const Flow: React.FC<FlowProps> = ({
  spell,
  parentRef,
  tab
}) => {
  const specJson = getNodeSpec()
  const globalConfig = useSelector((state: RootState) => state.globalConfig)
  const { projectId, currentAgentId } = globalConfig
  const { publish, events } = usePubSub()

  const [playing, setPlaying] = React.useState(false);
  const [miniMapOpen, setMiniMapOpen] = React.useState(false);

  const { SEND_COMMAND } = events

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    setGraphJson,
    nodeTypes,
    onConnect
  } = useBehaveGraphFlow({
    spell,
    specJson,
    tab
  });

  const {
    handleStartConnect,
    handleStopConnect,
    handlePaneClick,
    handlePaneContextMenu,
    nodePickerVisibility,
    handleAddNode,
    closeNodePicker,
    nodePickFilters
  } = useFlowHandlers({
    nodes,
    onEdgesChange,
    onNodesChange,
    specJSON: specJson,
    parentRef
  });

  const togglePlay = () => {
    if (playing) {
      publish(SEND_COMMAND, {
        projectId,
        agentId: currentAgentId,
        command: 'agent:core:pauseSpell',
        data: {
          spellId: spell.id
        }
      })
    } else {
      publish(SEND_COMMAND, {
        projectId,
        agentId: currentAgentId,
        command: 'agent:core:playSpell',
        data: {
          spellId: spell.id
        }
      })
    }
    setPlaying(!playing);
  };

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
      {miniMapOpen &&
        <MiniMap nodeStrokeWidth={3} maskColor="#69696930" nodeColor="var(--charcoal)" pannable zoomable />
      }
      {nodePickerVisibility && (
        <NodePicker
          position={nodePickerVisibility}
          filters={nodePickFilters}
          onPickNode={handleAddNode}
          onClose={closeNodePicker}
          specJSON={specJson}
        />
      )}
    </ReactFlow>
  );
};
