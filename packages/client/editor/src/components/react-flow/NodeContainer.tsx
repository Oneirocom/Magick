import { NodeCategory, NodeSpecJSON, VariableJSON } from '@magickml/behave-graph';
import cx from 'classnames';
import React, { PropsWithChildren } from 'react';

import { categoryColorMap, colors, valueTypeColorMap } from '../../utils/colors.js';
import { SpellInterface } from 'server/schemas';

import css from './node.module.css'

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
  running: boolean;
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
  running,
  graph
}) => {
  let colorName = categoryColorMap[category];
  if (colorName === undefined) {
    colorName = 'red';
  }

  let [backgroundColor, textColor] = colors[colorName];

  if (config?.variableId) {
    const variable = graph.variables.find(variable => variable.id === config.variableId) as VariableJSON
    if (variable) {
      const colorName = valueTypeColorMap[variable.valueTypeName]
      if (colorName) {
        [backgroundColor, textColor] = colors[colorName]
      }
    }
  }


  return (
    <div className={cx("relative")}>
      <div
        className={cx(
          'rounded text-white text-sm bg-[var(--foreground-color)] w-[150px] transition-all duration-300 opacity-100',
          selected && 'outline outline-1',
          fired && 'outline outline-2 outline-green-500',
          running && css.running
        )}
      >
        <div className={cx(
          `${backgroundColor} ${textColor} px-2 py-1 rounded-t opacity-100`
        )}>
          {title}{config?.label && ` - ${config.label}`}
        </div>
        <div
          className={`flex flex-col gap-1 py-1`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default NodeContainer;
