import { IRegistry } from '@magickml/behave-graph';
import React from 'react';
import { Background, BackgroundVariant, ReactFlow } from 'reactflow';

import CustomControls from './Controls.js';
import { NodePicker } from './NodePicker.js';
import { useBehaveGraphFlow } from '../../hooks/react-flow/useBehaveGraphFlow.js';
import { useFlowHandlers } from '../../hooks/react-flow/useFlowHandlers.js';
import { Tab } from '@magickml/providers';

import './flowOverrides.css'
import { SpellInterface } from 'server/schemas';
import { getNodeSpec } from 'shared/nodeSpec';

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

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    setGraphJson,
    nodeTypes,
    onConnect
  } = useBehaveGraphFlow({
    initialGraphJson: spell.graph,
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

  const playing = false;
  const togglePlay = () => { };

  return (
    <ReactFlow
      nodeTypes={nodeTypes}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
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
      />
      <Background
        variant={BackgroundVariant.Lines}
        color="var(--background-color)"
        style={{ backgroundColor: 'var(--deep-background-color)' }}
      />
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
