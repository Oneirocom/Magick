import { cx } from "class-variance-authority";
import { ConfigurationComponentProps } from "./PropertiesWindow"
import { useState } from "react";

const inputClass = cx(
  'bg-gray-600 disabled:bg-gray-700 w-full py-1 px-2 nodrag text-sm',
);

export const DefaultConfig = ({ valueType, config, updateConfigKey }: ConfigurationComponentProps) => {
  const [name, inputValue] = config
  const [inputVal, setInputVal] = useState(inputValue)

  const onChange = (key: string, value: any) => {
    setInputVal(value)
    updateConfigKey(key, value)
  }

  return (
    <div>
      <label className="mr-2">{name}</label>
      <div className="flex-1 justify-center">
        {valueType === 'string' && (
          <input
            type="text"
            className={inputClass}
            value={inputVal || ''}
            onChange={(e) => {
              onChange(name, e.currentTarget.value)
            }}
          />
        )}
        {valueType === 'number' && (
          <input
            type="number"
            className={inputClass}
            value={inputVal || 0}
            onChange={(e) => onChange(name, e.currentTarget.value)}
          />
        )}
        {valueType === 'float' && (
          <input
            type="number"
            className={inputClass}
            value={inputVal || 0}
            onChange={(e) => onChange(name, e.currentTarget.value)}
          />
        )}
        {valueType === 'integer' && (
          <input
            type="number"
            className={inputClass}
            value={inputVal || 0}
            onChange={(e) => onChange(name, e.currentTarget.value)}
          />
        )}
        {valueType === 'boolean' && (
          <input
            type="checkbox"
            className={inputClass}
            value={inputVal || 0}
            onChange={(e) => onChange(name, e.currentTarget.checked)}
          />
        )}
      </div>
    </div>
  )

}