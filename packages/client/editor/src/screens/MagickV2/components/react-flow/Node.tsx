import { NodeSpecJSON } from '@magickml/behave-graph';
import React from 'react';
import { NodeProps as FlowNodeProps, useEdges } from 'reactflow';

import { useChangeNodeData } from '../hooks/useChangeNodeData.js';
import { isHandleConnected } from '../util/isHandleConnected.js';
import InputSocket from './InputSocket.js';
import NodeContainer from './NodeContainer.js';
import OutputSocket from './OutputSocket.js';

type NodeProps = FlowNodeProps & {
  spec: NodeSpecJSON;
  allSpecs: NodeSpecJSON[];
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
  allSpecs
}: NodeProps) => {
  const edges = useEdges();
  const handleChange = useChangeNodeData(id);
  const pairs = getPairs(spec.inputs, spec.outputs);
  return (
    <NodeContainer
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
    </NodeContainer>
  );
};
