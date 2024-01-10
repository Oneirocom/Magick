import { NodeJSON, NodeSpecJSON } from '@magickml/behave-graph';
import React, { useEffect, useState } from 'react';
import { NodeProps as FlowNodeProps, useEdges, useUpdateNodeInternals } from 'reactflow';

import InputSocket from './InputSocket.js';
import NodeContainer from './NodeContainer.js';
import OutputSocket from './OutputSocket.js';
import { useChangeNodeData } from '../../hooks/react-flow/useChangeNodeData.js';
import { isHandleConnected } from '../../utils/isHandleConnected.js';
import { useSelectAgentsSpell } from 'client/state';
import { SpellInterface } from 'server/schemas';
import { getConfig } from '../../utils/getNodeConfig.js';
import { configureSockets } from '../../utils/configureSockets.js';

type NodeProps = FlowNodeProps & {
  spec: NodeSpecJSON;
  allSpecs: NodeSpecJSON[];
  spell: SpellInterface,
  nodeJSON: NodeJSON
};

export const Node: React.FC<NodeProps> = ({
  id,
  data,
  spec,
  selected,
  allSpecs,
  spell,
  nodeJSON,
}: NodeProps) => {
  const updateNodeInternals = useUpdateNodeInternals();
  const { lastItem: spellEvent } = useSelectAgentsSpell()
  const [endEventName, setEndEventName] = useState<string | null>(null)
  const [startEventName, setStartEventName] = useState<string | null>(null)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const edges = useEdges();
  const handleChange = useChangeNodeData(id);

  // if the node doesn't have a config yet, we need to make one for it and add it to the react flow node data
  if (!data.configuration) {
    const config = getConfig(nodeJSON, spec)
    handleChange('configuration', config)
  }

  useEffect(() => {
    updateNodeInternals(id);
  }, [data])

  const { configuration: config } = data
  const { pairs, valueInputs } = configureSockets(data, spec)

  useEffect(() => {
    if (!spell || !id) return;
    setEndEventName(`${spell.id}-${id}-end`)
    setStartEventName(`${spell.id}-${id}-start`)
  }, [spell, id])

  useEffect(() => {
    if (!spellEvent) return;
    if (spellEvent.event === endEventName) {
      // handleChange('eventName', spellEvent.eventName)
      setRunning(false)
      setDone(true)

      setTimeout(() => {
        setDone(false)
      }, 3000)
    }
  }, [spellEvent])

  useEffect(() => {
    if (!spellEvent) return;
    if (spellEvent.event === startEventName) {
      // handleChange('eventName', spellEvent.eventName)
      setRunning(true)
    }
  }, [spellEvent])

  return (
    <NodeContainer
      fired={done}
      running={running}
      title={spec.label}
      category={spec.category}
      selected={selected}
      graph={spell.graph}
      config={config}
    >
      {pairs.map(([flowInput, output], ix) => (
        <div
          key={ix}
          className="flex flex-row justify-between gap-8 relative px-2"
        // className={styles.container}
        >
          {flowInput && (
            <InputSocket
              {...flowInput}
              specJSON={allSpecs}
              value={data[flowInput.name] ?? flowInput.defaultValue}
              onChange={handleChange}
              connected={isHandleConnected(edges, id, flowInput.name, 'target')}
            />
          )}
          {output && (
            <OutputSocket
              {...output}
              specJSON={allSpecs}
              connected={isHandleConnected(edges, id, output.name, 'source')}
            />
          )}
        </div>
      ))}

      {valueInputs.map(input => (
        <div
          key={input.key}
          className="flex flex-row justify-start gap-8 relative px-2"
        // className={styles.container}
        >
          <InputSocket
            {...input}
            specJSON={allSpecs}
            value={data[input.name] ?? input.defaultValue}
            onChange={handleChange}
            connected={isHandleConnected(edges, id, input.name, 'target')}
          />
        </div>
      ))}
    </NodeContainer>
  );
};
