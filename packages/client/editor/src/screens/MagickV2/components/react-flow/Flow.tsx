import { GraphJSON, IRegistry } from '@magickml/behave-graph';
import React, { useCallback, useEffect } from 'react';
import { Background, BackgroundVariant, ReactFlow } from 'reactflow';

import CustomControls from './Controls.js';
import { Examples } from './modals/LoadModal';
import { NodePicker } from './NodePicker';
import { useNodeSpecJson } from '../../hooks/react-flow/useNodeSpecJson';
import { useBehaveGraphFlow } from '../../hooks/react-flow/useBehaveGraphFlow';
import { useFlowHandlers } from '../../hooks/react-flow/useFlowHandlers';
import { useGraphRunner } from '../../hooks/react-flow/useGraphRunner';

type FlowProps = {
  initialGraph: GraphJSON;
  registry: IRegistry;
  examples: Examples;
  parentRef: React.RefObject<HTMLDivElement>;
};

export const Flow: React.FC<FlowProps> = ({
  initialGraph: graph,
  registry,
  parentRef,
  examples
}) => {
  const specJson = useNodeSpecJson(registry);

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    graphJson,
    setGraphJson,
    nodeTypes
  } = useBehaveGraphFlow({
    initialGraphJson: graph,
    specJson
  });

  const {
    onConnect,
    handleStartConnect,
    handleStopConnect,
    handlePaneClick,
    handlePaneContextMenu,
    nodePickerVisibility,
    handleAddNode,
    lastConnectStart,
    closeNodePicker,
    nodePickFilters
  } = useFlowHandlers({
    nodes,
    onEdgesChange,
    onNodesChange,
    specJSON: specJson,
    parentRef
  });

  const { togglePlay, playing } = useGraphRunner({
    graphJson,
    registry
  });

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
        examples={examples}
        specJson={specJson}
      />
      <Background
        variant={BackgroundVariant.Lines}
        color="#2a2b2d"
        style={{ backgroundColor: '#1E1F22' }}
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
