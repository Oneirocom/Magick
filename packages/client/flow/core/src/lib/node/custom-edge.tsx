import {
  type EdgeProps,
  getBezierPath,
  EdgeLabelRenderer,
  useReactFlow,
} from 'reactflow'
import { valueTypeColorMap } from '../utils/colors'

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
}: EdgeProps) {
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
    valueTypeColorMap[data.valueType as keyof typeof valueTypeColorMap] ||
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
      <g>
        <path
          id={id}
          d={edgePathData[0]}
          stroke={strokeColor}
          fill="none"
          strokeWidth={selected ? 6 : 3}
        />
        {/* Optionally, add arrowheads or other SVG elements here */}
      </g>
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            // everything inside EdgeLabelRenderer has no pointer events by default
            // if you have an interactive element, set pointer-events: all
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <button
            style={edgeButtonStyle}
            className="edgebutton"
            onClick={onEdgeClick}
          >
            ×
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  )
}
