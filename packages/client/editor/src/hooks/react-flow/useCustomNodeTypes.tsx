import { NodeSpecJSON } from '@magickml/behave-graph';
import React from 'react';
import { useEffect, useState } from 'react';
import { NodeTypes } from 'reactflow';

import { Node } from '../../components/react-flow/Node';

const getCustomNodeTypes = (allSpecs: NodeSpecJSON[]) => {
  return allSpecs.reduce((nodes: NodeTypes, node) => {
    nodes[node.type] = (props) => (
      <Node spec={node} allSpecs={allSpecs} {...props} />
    );
    return nodes;
  }, {});
};

export const useCustomNodeTypes = ({
  specJson
}: {
  specJson: NodeSpecJSON[] | undefined;
}) => {
  const [customNodeTypes, setCustomNodeTypes] = useState<NodeTypes>();
  useEffect(() => {
    if (!specJson) return;
    const customNodeTypes = getCustomNodeTypes(specJson);

    setCustomNodeTypes(customNodeTypes);
  }, [specJson]);

  return customNodeTypes;
};
