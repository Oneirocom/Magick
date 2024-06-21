'use client'

import { InputSocketSpecJSON, NodeSpecJSON } from '@magickml/behave-graph'
import { faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cx from 'classnames'
import React, { useEffect, useState } from 'react'
import { Handle, Position } from '@xyflow/react'
import { colors, valueTypeColorMap } from '../utils/colors'
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
import { usePubSub } from '@magickml/providers'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, setActiveInput } from 'client/state'

export type InputSocketProps = {
  connected: boolean
  value: any | undefined
  onChange: (key: string, value: any) => void
  lastEventInput: any
  specJSON: NodeSpecJSON[]
  hideValue?: boolean
  textEditorState: string
  valueTypeName?: string
  nodeId: string
  hide?: boolean
  isActive?: boolean
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
  nodeId,
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
  | 'nodeId'
  | 'isActive'
>) => {
  const showChoices = choices?.length && choices.length > 0
  const [inputVal, setInputVal] = useState(value ? value : defaultValue ?? '')
  const hideValueInput = hideValue || connected
  const { subscribe, publish, events } = usePubSub()
  const { currentTab } = useSelector((state: RootState) => state.tabLayout)
  const dispatch = useDispatch()

  const inputClass = cx('h-5 text-sm')

  const containerClass = cx(
    'flex w-full rounded-sm items-center pl-1 rounded-sm',
    !hideValueInput && 'bg-[var(--foreground-color)]'
  )

  const handleChange = ({ key, value }: { key: string; value: any }) => {
    setInputVal(value)
    onChange(key, value)
    if (currentTab?.id && valueType === 'string') {
      publish(events.$INPUT_TO_CHAT(currentTab.id), {
        value: value,
        nodeId,
        name,
        inputType: valueType,
      })
    }
  }

  const onFocus = (x: string) => {
    if (valueType === 'string' && currentTab?.id) {
      // Note: Seems to be a race condition with the node selected event firing after the input is focused which breaks the text editor connection.
      setTimeout(() => {
        dispatch(
          setActiveInput({
            nodeId,
            name,
            inputType: valueType,
            value,
          })
        )

        publish(events.$INPUT_TO_CHAT(currentTab.id), {
          value: x,
          nodeId,
          name,
          inputType: valueType,
        })
        return
      }, 100)
    }
    setActiveInput(null)
  }

  const onBlur = () => {
    // setIsFocused(false)
  }
  useEffect(() => {
    if (!currentTab) return
    // Subscription function
    const subscribeToEvents = () => {
      return subscribe(
        events.$CHAT_TO_INPUT(currentTab.id),
        (eventName, { value, nodeId: incomingNodeId, name: incomingName }) => {
          if (nodeId !== incomingNodeId) return
          onChange(name, value)
          setInputVal(value || '')
        }
      )
    }

    // Initial subscription
    let unsubscribe: () => void
    if (isActive) {
      unsubscribe = subscribeToEvents()
    }

    // Effect cleanup and conditional resubscription
    return () => {
      if (unsubscribe) {
        unsubscribe()
      }

      // If isActive changes to false, unsubscribe
      if (isActive) {
        unsubscribe = subscribeToEvents()
      }
    }
  }, [currentTab, name, isActive, nodeId])

  useEffect(() => {}, [isActive])

  return (
    <div className={containerClass}>
      {/* flex layout these divs 50 50 */}
      <div className="flex flex-1 items-center h-8">
        <p className="flex">{name}</p>
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
            <Input
              value={inputVal}
              onChange={e => {
                handleChange({ key: name, value: e.currentTarget.value })
              }}
              onBlur={onBlur}
              // @ts-ignore
              onFocus={e => {
                onFocus(e.currentTarget.value)
              }} //TODO: REBASE_CHECK
              className="m-1 h-6"
            />
          )}
          {valueType === 'float' && !showChoices && (
            <Input
              type="number"
              step="0.01"
              className={inputClass}
              value={Number(value)}
              onChange={e => onChange(name, e.currentTarget.value)}
            />
          )}
          {valueType === 'integer' && !showChoices && (
            <Input
              type="number"
              className={inputClass}
              value={Number(value)}
              onChange={e => {
                onChange(name, Number(e.currentTarget.value))
              }}
            />
          )}
          {valueType === 'boolean' && !showChoices && (
            <div className="flex gap-2 items-center red">
              <Switch
                value={value}
                defaultChecked={value}
                onCheckedChange={value => {
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
  nodeId,
  hide,
  ...rest
}) => {
  const { name, valueTypeName } = rest
  let { valueType } = rest

  if (!valueType && valueTypeName) {
    valueType = valueTypeName
  }

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

  const className = cx(
    'flex grow items-center justify-start h-7 w-full',
    !connected && hide ? 'hidden' : ''
  )
  return (
    <div className={className}>
      {isFlowSocket && (
        <>
          <FontAwesomeIcon icon={faCaretRight} color="#ffffff" size="lg" />
          {showName && <div className="mr-2 truncate">{name}</div>}
        </>
      )}
      {!isFlowSocket && (
        <InputFieldForValue
          {...rest}
          connected={connected}
          hideValue={isArraySocket || isObjectSocket}
          isActive={isActive}
          valueType={valueType}
          nodeId={nodeId}
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
              [name]: lastEventInput,
            }}
            style={{ width: 400, overflow: 'scroll' }}
            theme="tomorrow"
            name={false}
            collapsed={1}
            collapseStringsAfterLength={20}
            shouldCollapse={(field: any) => {
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
