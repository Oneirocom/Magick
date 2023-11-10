import { NodeSpecJSON, OutputSocketSpecJSON } from '@magickml/behave-graph';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';
import React from 'react';
import { Connection, Handle, Position, useReactFlow } from 'reactflow';

import { colors, valueTypeColorMap } from '../../utils/colors.js';
import { isValidConnection } from '../../utils/isValidConnection.js';

export type OutputSocketProps = {
  connected: boolean;
  specJSON: NodeSpecJSON[];
} & OutputSocketSpecJSON;

export default function OutputSocket({
  specJSON,
  connected,
  valueType,
  name
}: OutputSocketProps) {
  const instance = useReactFlow();
  const isFlowSocket = valueType === 'flow';
  let colorName = valueTypeColorMap[valueType];
  if (colorName === undefined) {
    colorName = 'red';
  }
  // @ts-ignore
  const [backgroundColor, borderColor] = colors[colorName];
  const showName = isFlowSocket === false || name !== 'flow';

  return (
    <div className="flex grow items-center justify-end h-7">
      {showName && <div className="capitalize">{name}</div>}
      {isFlowSocket && (
        <FontAwesomeIcon
          icon={faCaretRight}
          color="#ffffff"
          size="lg"
          className="ml-1"
        />
      )}

      <Handle
        id={name}
        type="source"
        position={Position.Right}
        className={cx(borderColor, connected ? backgroundColor : 'bg-gray-800')}
        isValidConnection={(connection: Connection) =>
          isValidConnection(connection, instance, specJSON)
        }
      />
    </div>
  );
}
