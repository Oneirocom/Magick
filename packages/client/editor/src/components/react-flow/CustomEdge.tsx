import React from 'react';
import { EdgeProps, getBezierPath } from 'reactflow';
import { valueTypeColorMap } from '../../utils/colors';

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected
}: EdgeProps) {
  const edgePathData = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const strokeColor = valueTypeColorMap[data.valueType as keyof typeof valueTypeColorMap] || 'white';

  return (
    <g>
      <path id={id} d={edgePathData[0]} stroke={strokeColor} fill="none" strokeWidth={selected ? 6 : 3} />
      {/* Optionally, add arrowheads or other SVG elements here */}
    </g>
  );
}