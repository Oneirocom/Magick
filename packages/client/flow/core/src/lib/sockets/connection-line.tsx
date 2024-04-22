import { ReactFlowState, useStore } from 'reactflow'

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
  const { connectionHandleId } = useStore(getState)

  return (
    <g>
      <path
        fill="none"
        stroke={connectionHandleId || '#000'}
        strokeWidth={1.5}
        className="animated"
        d={`M${fromX},${fromY} C ${fromX} ${toY} ${fromX} ${toY} ${toX},${toY}`}
      />
      <circle
        cx={toX}
        cy={toY}
        fill="#fff"
        r={3}
        stroke={connectionHandleId || '#000'}
        strokeWidth={1.5}
      />
    </g>
  )
}
