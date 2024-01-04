import { NodeCategory, NodeSpecJSON, VariableJSON } from '@magickml/behave-graph';
import cx from 'classnames';
import React, { PropsWithChildren } from 'react';

import { categoryColorMap, colors, valueTypeColorMap } from '../../utils/colors.js';
import { SpellInterface } from 'server/schemas';

type Config = {
  label?: string
  variableId?: string
}

type NodeProps = {
  title: string;
  category?: NodeSpecJSON['category'];
  selected: boolean;
  onClick?: () => void;
  fired: boolean;
  config: Config
  graph: SpellInterface['graph']
};

const NodeContainer: React.FC<PropsWithChildren<NodeProps>> = ({
  title,
  category = NodeCategory.None,
  selected,
  children,
  fired,
  config,
  graph
}) => {
  let colorName = categoryColorMap[category];
  if (colorName === undefined) {
    colorName = 'red';
  }

  let [backgroundColor, textColor] = colors[colorName];

  if (config.variableId) {
    const variable = graph.variables.find(variable => variable.id === config.variableId) as VariableJSON
    if (variable) {
      const colorName = valueTypeColorMap[variable.valueTypeName]
      if (colorName) {
        [backgroundColor, textColor] = colors[colorName]
      }
    }
  }


  return (
    <div
      className={cx(
        'rounded text-white text-sm bg-[var(--background-color)] w-[150px] transition-all duration-300',
        selected && 'outline outline-1',
        fired && 'outline outline-2 outline-green-500'
      )}
    >
      <div className={`${backgroundColor} ${textColor} px-2 py-1 rounded-t`}>
        {title}{config?.label && ` - ${config.label}`}
      </div>
      <div
        className={`flex flex-col gap-2 py-1`}
      >
        {children}
      </div>
    </div>
  );
};

export default NodeContainer;
