import { NodeSpecJSON } from '@magickml/behave-graph';
import React from 'react';
import { useEffect, useState } from 'react';
import { NodeTypes, NodeProps } from 'reactflow';

import { Node } from '../../components/react-flow/Node';
import { SpellInterface } from 'server/schemas';

const getCustomNodeTypes = (allSpecs: NodeSpecJSON[], spell: SpellInterface) => {
  return allSpecs.reduce((nodes: NodeTypes, node) => {
    nodes[node.type] = (props) => {
      const nodeJSON = spell?.graph.nodes?.find(node => node.id === props.id)
      return <Node spec={node} nodeJSON={nodeJSON} allSpecs={allSpecs} spell={spell} {...props} />
    }
    return nodes;
  }, {});
};

export const useCustomNodeTypes = ({
  specJson,
  spell
}: {
  specJson: NodeSpecJSON[] | undefined
  spell: SpellInterface
}) => {
  const [customNodeTypes, setCustomNodeTypes] = useState<NodeTypes>();
  useEffect(() => {
    if (!specJson) return;
    const customNodeTypes = getCustomNodeTypes(specJson, spell);

    setCustomNodeTypes(customNodeTypes);
  }, [specJson, spell]);

  return customNodeTypes;
};
