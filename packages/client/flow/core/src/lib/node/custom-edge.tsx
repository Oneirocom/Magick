"use client"

import {
  type EdgeProps,
  getBezierPath,
  EdgeLabelRenderer,
  useReactFlow,
} from '@xyflow/react'
import { valueTypeColorMap } from '../utils/colors'
import { useState } from 'react'
import { MagickEdgeType } from '@magickml/client-types'

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: EdgeProps<MagickEdgeType>) {
  const [isHovered, setIsHovered] = useState(false)
  const edgePathData = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const [, labelX, labelY] = edgePathData

  const instance = useReactFlow()

  const strokeColor =
    valueTypeColorMap[data?.valueType as keyof typeof valueTypeColorMap] ||
    'white'

  const edgeButtonStyle = {
    width: 15,
    height: 15,
    background: strokeColor,
    cursor: 'pointer',
    borderRadius: '50%',
    fontSize: 12,
    color: strokeColor !== 'white' ? '#fff' : '#000',
    lineHeight: 1,
    zIndex: 100,
  }

  const onEdgeClick = () => {
    instance.setEdges(edges => edges.filter(edge => edge.id !== id))
  }

  return (
    <>
      <g
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <path
          id={id}
          d={edgePathData[0]}
          stroke={strokeColor}
          fill="none"
          strokeWidth={selected ? 6 : 3}
          style={{ cursor: 'pointer' }}
        />
        {/* Invisible stroke to increase hover area */}
        <path
          d={edgePathData[0]}
          stroke="transparent"
          fill="none"
          strokeWidth={24} // Double the visible stroke width
          style={{ pointerEvents: 'stroke', cursor: 'pointer' }}
        />
        {/* Optionally, add arrowheads or other SVG elements here */}
      </g>

      {isHovered && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontSize: 12,
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
          >
            <button
              style={edgeButtonStyle}
              className="edgebutton"
              onClick={onEdgeClick}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              ×
            </button>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
}
