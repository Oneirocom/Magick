"use client"

import { ReactFlowState, useStore } from '@xyflow/react'

const getState = (state: ReactFlowState) => {
  console.log('STATE', state)
  return state || {}
}

interface ConnectionLineProps {
  fromX: number
  fromY: number
  toX: number
  toY: number
}

export const ConnectionLine = ({
  fromX,
  fromY,
  toX,
  toY,
}: ConnectionLineProps) => {
  const { connectionStartHandle } = useStore(getState)

  return (
    <g>
      <path
        fill="none"
        stroke={connectionStartHandle?.nodeId || '#000'}
        strokeWidth={1.5}
        className="animated"
        d={`M${fromX},${fromY} C ${fromX} ${toY} ${fromX} ${toY} ${toX},${toY}`}
      />
      <circle
        cx={toX}
        cy={toY}
        fill="#fff"
        r={3}
        stroke={connectionStartHandle?.nodeId || '#000'}
        strokeWidth={1.5}
      />
    </g>
  )
}
