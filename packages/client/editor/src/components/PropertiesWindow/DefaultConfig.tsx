import { cx } from 'class-variance-authority'
import { ConfigurationComponentProps } from './PropertiesWindow'
import { useState } from 'react'
import { Input, Switch } from '@magickml/client-ui'

export const DefaultConfig = ({
  valueType,
  config,
  updateConfigKey,
}: ConfigurationComponentProps) => {
  const [name, inputValue] = config
  const [inputVal, setInputVal] = useState(inputValue)

  const onChange = (key: string, value: any) => {
    setInputVal(value)
    updateConfigKey(key, value)
  }

  return (
    <div>
      <label className="mr-2 mb-2">{name}</label>
      <div className="">
        {valueType === 'string' && (
          <Input
            type="text"
            value={inputVal || ''}
            onChange={e => {
              onChange(name, e.currentTarget.value)
            }}
          />
        )}
        {valueType === 'number' && (
          <Input
            type="number"
            value={inputVal || 0}
            onChange={e => onChange(name, e.currentTarget.value)}
          />
        )}
        {valueType === 'float' && (
          <Input
            type="number"
            value={inputVal || 0}
            onChange={e => onChange(name, e.currentTarget.value)}
          />
        )}
        {valueType === 'integer' && (
          <Input
            type="number"
            value={inputVal || 0}
            onChange={e => onChange(name, e.currentTarget.value)}
          />
        )}
        {valueType === 'boolean' && (
          <div className="flex gap-2 items-center red">
            <Switch
              defaultChecked={inputVal}
              value={inputVal || 0}
              onCheckedChange={value => onChange(name, value)}
              // onFocus={() => onFocus(value)}
            />
          </div>
        )}
      </div>
    </div>
  )
}
