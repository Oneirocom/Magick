import { NodeCategory, NodeSpecJSON } from '@magickml/behave-graph';
import cx from 'classnames';
import React, { PropsWithChildren } from 'react';

import { categoryColorMap, colors } from '../../utils/colors.js';

type NodeProps = {
  title: string;
  category?: NodeSpecJSON['category'];
  selected: boolean;
};

const NodeContainer: React.FC<PropsWithChildren<NodeProps>> = ({
  title,
  category = NodeCategory.None,
  selected,
  children
}) => {
  let colorName = categoryColorMap[category];
  if (colorName === undefined) {
    colorName = 'red';
  }
  let [backgroundColor, borderColor, textColor] = colors[colorName];
  if (selected) {
    borderColor = 'border-gray-800';
  }
  return (
    <div
      className={cx(
        'rounded text-white text-sm bg-gray-800 min-w-[120px]',
        selected && 'outline outline-1'
      )}
    >
      <div className={`${backgroundColor} ${textColor} px-2 py-1 rounded-t`}>
        {title}
      </div>
      <div
        className={`flex flex-col gap-2 py-2 border-l border-r border-b ${borderColor} `}
      >
        {children}
      </div>
    </div>
  );
};

export default NodeContainer;
