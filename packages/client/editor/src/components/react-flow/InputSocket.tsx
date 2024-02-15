import { InputSocketSpecJSON, NodeSpecJSON } from '@magickml/behave-graph'
import { faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cx from 'classnames'
import React, { useEffect, useState } from 'react'
import { Handle, Position } from 'reactflow'

import { colors, valueTypeColorMap } from '../../utils/colors'
import {
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from '@magickml/client-ui'
import ReactJson from 'react-json-view'
import { TextInputField } from './TextInputField'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectTextEditorState,
  setActiveInput,
  setTextEditorState,
} from 'client/state'

export type InputSocketProps = {
  connected: boolean
  value: any | undefined
  onChange: (key: string, value: any) => void
  lastEventInput: any
  specJSON: NodeSpecJSON[]
  hideValue?: boolean
  isActive: boolean
  textEditorState: string
} & InputSocketSpecJSON

const InputFieldForValue = ({
  choices,
  value,
  defaultValue,
  onChange,
  name,
  valueType,
  connected,
  hideValue = false,
  isActive,
}: Pick<
  InputSocketProps,
  | 'choices'
  | 'value'
  | 'defaultValue'
  | 'name'
  | 'onChange'
  | 'valueType'
  | 'connected'
  | 'hideValue'
  | 'isActive'
>) => {
  const dispatch = useDispatch()
  const textEditorState = useSelector(selectTextEditorState)
  const showChoices = choices?.length
  const [inputVal, setInputVal] = useState(value ? value : defaultValue ?? '')
  const hideValueInput = hideValue || connected

  const inputClass = cx('h-6 text-sm')

  const containerClass = cx(
    'flex w-full rounded-sm items-center pl-1 rounded-sm',
    !hideValueInput && 'bg-[var(--foreground-color)]'
  )

  const handleChange = ({ key, value }: { key: string; value: any }) => {
    onChange(key, value)
    setInputVal(value)
    dispatch(setTextEditorState(value))
  }

  const onFocus = (x: string) => {
    handleChange({ key: name, value: x })
    dispatch(setActiveInput(name))
  }

  useEffect(() => {
    if (isActive) {
      handleChange({ key: name, value: textEditorState || '' })
      setInputVal(textEditorState || '')
    }
  }, [isActive, textEditorState])

  return (
    <div className={containerClass}>
      {/* flex layout these divs 50 50 */}
      <div className="flex flex-1 items-center h-8">
        <p className="flex capitalize">{name}</p>
      </div>
      {!hideValueInput && (
        <div className="flex-1 justify-center">
          {showChoices && (
            <Select
              onValueChange={value => onChange(name, value)}
              defaultValue={value}
            >
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {choices.map(choice => (
                  <SelectItem key={choice.text} value={choice.value}>
                    {choice.text}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {valueType === 'string' && !showChoices && (
            <TextInputField
              value={inputVal}
              onChange={e =>
                handleChange({ key: name, value: e.currentTarget.value })
              }
              onFocus={() => onFocus(inputVal)}
              className="m-1 h-6"
            />
          )}
          {valueType === 'float' && !showChoices && (
            <Input
              type="number"
              step="0.01"
              className={inputClass}
              value={inputVal}
              onChange={e => onChange(name, e.currentTarget.value)}
            />
          )}
          {valueType === 'integer' && !showChoices && (
            <Input
              type="number"
              className={inputClass}
              value={inputVal}
              onChange={e => {
                console.log('onChange', e.currentTarget.value)
                onChange(name, e.currentTarget.value)
              }}
            />
          )}
          {valueType === 'boolean' && !showChoices && (
            <div className="flex gap-2 items-center">
              <Switch
                defaultValue={inputVal || 0}
                onChange={value => {
                  onChange(name, value)
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const InputSocket: React.FC<InputSocketProps> = ({
  connected,
  specJSON,
  lastEventInput,
  isActive,
  textEditorState,
  ...rest
}) => {
  const { name, valueType } = rest

  const isFlowSocket = valueType === 'flow'
  const isArraySocket = valueType === 'array'
  const isObjectSocket = valueType === 'object'

  let colorName = valueTypeColorMap[valueType]
  if (colorName === undefined) {
    colorName = 'red'
  }

  // @ts-ignore
  const [backgroundColor, borderColor] = colors[colorName]
  const showName = isFlowSocket === false || name !== 'flow'
  return (
    <div className="flex grow items-center justify-start h-7 w-full">
      {isFlowSocket && (
        <>
          <FontAwesomeIcon icon={faCaretRight} color="#ffffff" size="lg" />
          {showName && <div className="capitalize mr-2 truncate">{name}</div>}
        </>
      )}
      {!isFlowSocket && (
        <InputFieldForValue
          connected={connected}
          hideValue={isArraySocket || isObjectSocket}
          isActive={isActive}
          {...rest}
        />
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Handle
            id={name}
            type="target"
            position={Position.Left}
            className={cx(
              borderColor,
              connected ? backgroundColor : 'bg-gray-800'
            )}
          />
        </PopoverTrigger>
        <PopoverContent className="w-120" style={{ zIndex: 150 }} side="left">
          <ReactJson
            src={{
              [name]: lastEventInput || undefined,
            }}
            style={{ width: 400, overflow: 'scroll' }}
            theme="tomorrow"
            name={false}
            collapsed={1}
            collapseStringsAfterLength={20}
            shouldCollapse={(field: any) => {
              console.log('Should collapse', field)
              return typeof field === 'string' && field.length > 20
            }}
            enableClipboard={true}
            displayObjectSize={false}
            displayDataTypes={false}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default InputSocket
