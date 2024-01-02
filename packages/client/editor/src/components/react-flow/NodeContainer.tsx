import { NodeCategory, NodeSpecJSON } from '@magickml/behave-graph';
import cx from 'classnames';
import React, { PropsWithChildren } from 'react';

import { categoryColorMap, colors } from '../../utils/colors.js';

type NodeProps = {
  title: string;
  category?: NodeSpecJSON['category'];
  selected: boolean;
  onClick?: () => void;
  fired: boolean;
};

const NodeContainer: React.FC<PropsWithChildren<NodeProps>> = ({
  title,
  category = NodeCategory.None,
  selected,
  children,
  fired
}) => {
  let colorName = categoryColorMap[category];
  if (colorName === undefined) {
    colorName = 'red';
  }
  const [backgroundColor, textColor] = colors[colorName];

  return (
    <div
      className={cx(
        'rounded text-white text-sm bg-[var(--background-color)] w-[150px] transition-all duration-300',
        selected && 'outline outline-1',
        fired && 'outline outline-2 outline-green-500'
      )}
    >
      <div className={`${backgroundColor} ${textColor} px-2 py-1 rounded-t`}>
        {title}
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
