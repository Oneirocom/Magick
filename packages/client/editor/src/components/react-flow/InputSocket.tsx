import { InputSocketSpecJSON, NodeSpecJSON } from '@magickml/behave-graph';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';
import React from 'react';
import { Handle, Position } from 'reactflow';

import { colors, valueTypeColorMap } from '../../utils/colors.js';
import { Popover, PopoverContent, PopoverTrigger } from '@magickml/ui';
import ReactJson from 'react-json-view';

export type InputSocketProps = {
  connected: boolean;
  value: any | undefined;
  onChange: (key: string, value: any) => void;
  lastEventInput: any;
  specJSON: NodeSpecJSON[];
  hideValue?: boolean;
} & InputSocketSpecJSON;

const InputFieldForValue = ({
  choices,
  value,
  defaultValue,
  onChange,
  name,
  valueType,
  connected,
  hideValue = false
}: Pick<
  InputSocketProps,
  'choices' | 'value' | 'defaultValue' | 'name' | 'onChange' | 'valueType' | 'connected' | 'hideValue'
>) => {
  const showChoices = choices?.length;
  const inputVal = (value ? value : defaultValue ?? '') as string;
  const hideValueInput = hideValue || connected

  const inputClass = cx(
    'bg-gray-600 disabled:bg-gray-700 w-full py-1 px-2 nodrag text-sm',
  );

  const containerClass = cx(
    "flex w-full rounded-lg items-center pl-4",
    !hideValueInput && "bg-[var(--foreground-color)]"
  )

  const handleChange = (key: string, value: any) => {
    onChange(key, value);
  }

  return (
    <div style={{ borderRadius: 5 }} className={containerClass}>
      {/* flex layout these divs 50 50 */}
      <div className="flex flex-1 items-center h-full">
        <p className="flex capitalize">{name}</p>
      </div>
      {!hideValueInput && (
        <div className="flex-1 justify-center">
          {showChoices && (
            <select
              className={inputClass}
              value={value ?? defaultValue ?? ''}
              onChange={(e) => handleChange(name, e.currentTarget.value)}
            >
              <>
                {choices.map((choice) => (
                  <option key={choice.text} value={choice.value}>
                    {choice.text}
                  </option>
                ))}
              </>
            </select>
          )}
          {valueType === 'string' && !showChoices && (
            <input
              type="text"
              className={inputClass}
              value={String(inputVal) || ''}
              onChange={(e) => {
                onChange(name, e.currentTarget.value)
              }}
            />
          )}
          {valueType === 'float' && !showChoices && (
            <input
              type="number"
              className={inputClass}
              value={Number(inputVal) || 0}
              onChange={(e) => onChange(name, Number(e.currentTarget.value))}
            />
          )}
          {valueType === 'integer' && !showChoices && (
            <input
              type="number"
              className={inputClass}
              value={Number(inputVal) || 0}
              onChange={(e) => onChange(name, Number(e.currentTarget.value))}
            />
          )}
          {valueType === 'boolean' && !showChoices && (
            <input
              type="checkbox"
              className={inputClass}
              checked={Boolean(inputVal)}
              onChange={(e) => onChange(name, Boolean(e.currentTarget.checked))}
            />
          )}

        </div>
      )}
    </div>
  );
};


const InputSocket: React.FC<InputSocketProps> = ({
  connected,
  specJSON,
  lastEventInput,
  ...rest
}) => {
  const { name, valueType } = rest;

  const isFlowSocket = valueType === 'flow';
  const isArraySocket = valueType === 'array';
  const isObjectSocket = valueType === 'object';

  let colorName = valueTypeColorMap[valueType];
  if (colorName === undefined) {
    colorName = 'red';
  }

  // @ts-ignore
  const [backgroundColor, borderColor] = colors[colorName];
  const showName = isFlowSocket === false || name !== 'flow';

  return (
    <div className="flex grow items-center justify-start h-7 w-full">
      {isFlowSocket && (
        <>
          <FontAwesomeIcon icon={faCaretRight} color="#ffffff" size="lg" />
          {showName && <div className="capitalize mr-2">{name}</div>}
        </>
      )}

      {!isFlowSocket && <InputFieldForValue connected={connected} hideValue={isArraySocket || isObjectSocket} {...rest} />}


      <Popover>
        <PopoverTrigger asChild>
          <Handle
            id={name}
            type="target"
            position={Position.Left}
            className={cx(borderColor, connected ? backgroundColor : 'bg-gray-800')}
          />
        </PopoverTrigger>
        <PopoverContent className="w-120" style={{ zIndex: 150 }} side="left">
          <ReactJson
            src={{
              [name]: lastEventInput || undefined
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
  );
};

export default InputSocket;
