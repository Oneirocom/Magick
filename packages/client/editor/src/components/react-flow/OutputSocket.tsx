import { NodeSpecJSON, OutputSocketSpecJSON } from '@magickml/behave-graph'
import { faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ReactJson from 'react-json-view'
import cx from 'classnames'
import { Handle, Position } from 'reactflow'

import { colors, valueTypeColorMap } from '../../utils/colors'
import { Popover, PopoverContent, PopoverTrigger } from '@magickml/ui'

export type OutputSocketProps = {
  connected: boolean
  specJSON: NodeSpecJSON[]
  lastEventOutput: any
} & OutputSocketSpecJSON

export default function OutputSocket(props: OutputSocketProps) {
  const { connected, valueType, name } = props
  const isFlowSocket = valueType === 'flow'
  let colorName = valueTypeColorMap[valueType]
  if (colorName === undefined) {
    colorName = 'red'
  }
  // @ts-ignore
  const [backgroundColor, borderColor] = colors[colorName]
  const showName = isFlowSocket === false || name !== 'flow'

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

      <Popover>
        <PopoverTrigger asChild>
          <Handle
            id={name}
            type="source"
            position={Position.Right}
            className={cx(
              borderColor,
              connected ? backgroundColor : 'bg-gray-800'
            )}
          />
        </PopoverTrigger>
        <PopoverContent className="w-120" style={{ zIndex: 150 }} side="right">
          <ReactJson
            src={{
              [name]: props.lastEventOutput || undefined,
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
