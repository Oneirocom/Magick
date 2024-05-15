import { NodeSpecJSON, OutputSocketSpecJSON } from '@magickml/behave-graph'
import { faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ReactJson from 'react-json-view'
import { cn } from '@magickml/client-ui'
import { Handle, Position } from '@xyflow/react'

import { colors, valueTypeColorMap } from '../utils/colors'
import { Popover, PopoverContent, PopoverTrigger } from '@magickml/client-ui'
import { cx } from 'class-variance-authority'

export type OutputSocketProps = {
  connected: boolean
  specJSON: NodeSpecJSON[]
  lastEventOutput: any
  hide?: boolean
} & OutputSocketSpecJSON

export default function OutputSocket(props: OutputSocketProps) {
  const { connected, valueType, name, hide } = props
  const isFlowSocket = valueType === 'flow'
  let colorName = valueTypeColorMap[valueType]
  if (colorName === undefined) {
    colorName = 'red'
  }
  const [backgroundColor, borderColor] = colors[colorName]
  const showName = isFlowSocket === false || name !== 'flow'

  const className = cx(
    'flex grow items-center justify-end h-7',
    !connected && hide ? 'hidden' : ''
  )

  return (
    <div className={className}>
      {showName && <div>{name}</div>}
      {isFlowSocket && (
        <FontAwesomeIcon
          icon={faCaretRight}
          color="#ffffff"
          size="lg"
          className="ml-1"
        />
      )}

      <Popover>
        <PopoverTrigger asChild>
          <Handle
            id={name}
            type="source"
            position={Position.Right}
            className={cn(
              borderColor,
              connected ? backgroundColor : 'bg-gray-800'
            )}
          />
        </PopoverTrigger>
        <PopoverContent className="w-120" style={{ zIndex: 150 }} side="right">
          <ReactJson
            src={{
              [name]: props.lastEventOutput,
            }}
            theme="tomorrow"
            name={false}
            style={{ width: 400, overflow: 'scroll' }}
            collapsed={1}
            collapseStringsAfterLength={20}
            enableClipboard={true}
            displayObjectSize={false}
            displayDataTypes={false}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
