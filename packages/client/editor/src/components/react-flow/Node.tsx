import { NodeJSON, NodeSpecJSON } from '@magickml/behave-graph';
import React, { useEffect, useState } from 'react';
import { NodeProps as FlowNodeProps, useEdges } from 'reactflow';

import InputSocket from './InputSocket.js';
import NodeContainer from './NodeContainer.js';
import OutputSocket from './OutputSocket.js';
import { useChangeNodeData } from '../../hooks/react-flow/useChangeNodeData.js';
import { isHandleConnected } from '../../utils/isHandleConnected.js';
import { useSelectAgentsSpell } from 'client/state';
import { SpellInterface } from 'server/schemas';
import { getConfig } from '../../utils/getNodeConfig.js';

type NodeProps = FlowNodeProps & {
  spec: NodeSpecJSON;
  allSpecs: NodeSpecJSON[];
  spell: SpellInterface,
  nodeJSON: NodeJSON
};

const getPairs = <T, U>(arr1: T[], arr2: U[]) => {
  const max = Math.max(arr1.length, arr2.length);
  const pairs = [];
  for (let i = 0; i < max; i++) {
    const pair: [T | undefined, U | undefined] = [arr1[i], arr2[i]];
    pairs.push(pair);
  }
  return pairs;
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
  const { lastItem: spellEvent } = useSelectAgentsSpell()
  const [eventName, setEventName] = useState<string | null>(null)
  const [fired, setFired] = useState(false)
  const edges = useEdges();
  const handleChange = useChangeNodeData(id);

  // if the node doesn't have a config yet, we need to make one for it and add it to the react flow node data
  if (!data.configuration) {
    const config = getConfig(nodeJSON, spec)
    handleChange('configuration', config)
  }

  const { configuration: config } = data

  const configInputs = config?.socketInputs || []
  const configOutputs = config?.socketOutputs || []
  const inputs = [...spec.inputs, ...configInputs]
  const outputs = [...spec.outputs, ...configOutputs]

  const flowInputs = inputs.filter(input => input.valueType === 'flow')
  const flowOutputs = outputs.filter(output => output.valueType === 'flow')

  const valueInputs = inputs.filter(input => input.valueType !== 'flow')
  const valueOutputs = outputs.filter(output => output.valueType !== 'flow')

  const pairs = getPairs(flowInputs, [...flowOutputs, ...valueOutputs]);

  useEffect(() => {
    if (!spell || !id) return;
    setEventName(`${spell.id}-${id}`)
  }, [spell, id])

  useEffect(() => {
    if (!spellEvent) return;
    if (spellEvent.event === eventName) {
      // handleChange('eventName', spellEvent.eventName)
      setFired(true)

      setTimeout(() => {
        setFired(false)
      }, 3000)
    }
  }, [spellEvent])

  return (
    <NodeContainer
      fired={fired}
      title={spec.label}
      category={spec.category}
      selected={selected}
    >
      {pairs.map(([input, output], ix) => (
        <div
          key={ix}
          className="flex flex-row justify-between gap-8 relative px-2"
        // className={styles.container}
        >
          {input && (
            <InputSocket
              {...input}
              specJSON={allSpecs}
              value={data[input.name] ?? input.defaultValue}
              onChange={handleChange}
              connected={isHandleConnected(edges, id, input.name, 'target')}
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
