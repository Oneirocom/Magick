import { InputSocketSpecJSON, NodeSpecJSON } from '@magickml/behave-graph';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';
import React, { useEffect, useState } from 'react';
import { Connection, Handle, Position, useReactFlow } from 'reactflow';

import { colors, valueTypeColorMap } from '../../utils/colors.js';
import { isValidConnection } from '../../utils/isValidConnection.js';
import { AutoSizeInput } from './AutoSizeInput.js';

export type InputSocketProps = {
  connected: boolean;
  value: any | undefined;
  onChange: (key: string, value: any) => void;
  specJSON: NodeSpecJSON[];
} & InputSocketSpecJSON;

const InputFieldForValue = ({
  choices,
  value,
  defaultValue,
  onChange,
  name,
  valueType,
  connected
}: Pick<
  InputSocketProps,
  'choices' | 'value' | 'defaultValue' | 'name' | 'onChange' | 'valueType' | 'connected'
>) => {
  const showChoices = choices?.length;
  const inputVal = (String(value) ?? defaultValue ?? '') as string;

  const inputClass = cx(
    'bg-gray-600 disabled:bg-gray-700 w-full py-1 px-2 nodrag text-sm',
  );

  const containerClass = cx(
    "flex w-full rounded-lg items-center pl-4",
    !connected && "bg-[var(--foreground-color)]"
  )

  return (
    <div style={{ borderRadius: 5 }} className={containerClass}>
      {/* flex layout these divs 50 50 */}
      <div className="flex flex-1 items-center h-full">
        <p className="flex">{name}</p>
      </div>
      {!connected && (
        <div className="flex-1 justify-center">
          {showChoices && (
            <select
              className={inputClass}
              value={value ?? defaultValue ?? ''}
              onChange={(e) => onChange(name, e.currentTarget.value)}
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
              value={inputVal || ''}
              onChange={(e) => {
                onChange(name, e.currentTarget.value)
              }}
            />
          )}
          {valueType === 'number' && !showChoices && (
            <input
              type="number"
              className={inputClass}
              value={inputVal || 0}
              onChange={(e) => onChange(name, e.currentTarget.value)}
            />
          )}
          {valueType === 'float' && !showChoices && (
            <input
              type="number"
              className={inputClass}
              value={inputVal || 0}
              onChange={(e) => onChange(name, e.currentTarget.value)}
            />
          )}
          {valueType === 'integer' && !showChoices && (
            <input
              type="number"
              className={inputClass}
              value={inputVal || 0}
              onChange={(e) => onChange(name, e.currentTarget.value)}
            />
          )}
          {valueType === 'boolean' && !showChoices && (
            <input
              type="checkbox"
              className={inputClass}
              value={inputVal || 0}
              onChange={(e) => onChange(name, e.currentTarget.checked)}
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
  ...rest
}) => {
  const { name, valueType } = rest;
  const instance = useReactFlow();

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

      {!isFlowSocket && !isArraySocket && !isObjectSocket && <InputFieldForValue connected={connected} {...rest} />}
      <Handle
        id={name}
        type="target"
        position={Position.Left}
        className={cx(borderColor, connected ? backgroundColor : 'bg-gray-800')}
        isValidConnection={(connection: Connection) =>
          isValidConnection(connection, instance, specJSON)
        }
      />
    </div>
  );
};

export default InputSocket;
