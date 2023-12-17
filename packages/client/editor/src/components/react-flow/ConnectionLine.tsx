import React from 'react';
import { useStore } from 'reactflow';

const getState = (state) => {
  console.log('STATE', state);
  return state || {};
}

export const ConnectionLine = ({ fromX, fromY, toX, toY }) => {
  const { connectionHandleId } = useStore(getState);

  console.log('CONNECTIOn')

  return (
    <g>
      <path
        fill="none"
        stroke={connectionHandleId}
        strokeWidth={1.5}
        className="animated"
        d={`M${fromX},${fromY} C ${fromX} ${toY} ${fromX} ${toY} ${toX},${toY}`}
      />
      <circle
        cx={toX}
        cy={toY}
        fill="#fff"
        r={3}
        stroke={connectionHandleId}
        strokeWidth={1.5}
      />
    </g>
  );
};
