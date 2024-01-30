import { NodeSpecJSON } from '@magickml/behave-graph';
import { useEffect, useState } from 'react';
import { NodeTypes } from 'reactflow';

import { Node } from '../../components/react-flow/Node';
import { SpellInterface } from 'server/schemas';
import { Tab } from '@magickml/providers';

const getCustomNodeTypes = (allSpecs: NodeSpecJSON[], spell: SpellInterface, tab: Tab) => {
  return allSpecs.reduce((nodes: NodeTypes, node) => {
    nodes[node.type] = (props) => {
      const nodeJSON = spell?.graph.nodes?.find(node => node.id === props.id)
      return <Node tab={tab} spec={node} nodeJSON={nodeJSON} allSpecs={allSpecs} spell={spell} {...props} />
    }
    return nodes;
  }, {});
};

export const useCustomNodeTypes = ({
  specJson,
  spell,
  tab
}: {
  specJson: NodeSpecJSON[] | undefined
  spell: SpellInterface,
  tab: Tab
}) => {
  const [customNodeTypes, setCustomNodeTypes] = useState<NodeTypes>();
  useEffect(() => {
    if (!specJson) return;
    const customNodeTypes = getCustomNodeTypes(specJson, spell, tab);

    setCustomNodeTypes(customNodeTypes);
  }, [specJson, spell]);

  return customNodeTypes;
};
