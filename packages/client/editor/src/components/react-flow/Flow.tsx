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
import { categoryColorMap, colors } from '../../utils/colors.js';

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
    parentRef,
    tab
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
        <MiniMap nodeStrokeWidth={3} maskColor="#69696930" nodeColor={(node) => nodeColor(node, specJson)} pannable zoomable />
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

function getCategory(node, specJson) {
  return specJson.find(spec => spec.type === node.type).category
}

function nodeColor(node, specJson) {
  console.log('getting node color')
  const nodeCategory = getCategory(node, specJson)
  let colorName = categoryColorMap[nodeCategory];

  if (colorName === undefined) {
    colorName = 'red';
  }
  let [backgroundColor] = colors[colorName];

  const color = getHexColorFromTailwindClass(backgroundColor)

  return color;
}

function getHexColorFromTailwindClass(className) {
  // Create a temporary element
  const tempElement = document.createElement('div');
  tempElement.className = className;

  // Append it to the body (it won't be visible)
  document.body.appendChild(tempElement);

  // Get the computed style
  const style = window.getComputedStyle(tempElement);
  const rgb = style.backgroundColor;

  // Remove the element from the DOM
  document.body.removeChild(tempElement);

  // Convert RGB to Hex
  const rgbMatch = rgb.match(/\d+/g);
  if (!rgbMatch) return null;

  const hex = `#${rgbMatch.map(x => {
    const hex = parseInt(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('')}`;

  return hex;
}

