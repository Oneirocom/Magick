import { VariableJSON } from '@magickml/behave-graph'
import { TrashIcon } from '@heroicons/react/24/outline'
import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from '@magickml/client-ui'
import { cx } from 'class-variance-authority'
import { debounce } from 'lodash'
import { useEffect, useState } from 'react'

const inputClass = cx('w-full py-1 px-2 nodrag text-md justify-start flex')

// todo we need to centralize these types
const valueTypes = ['boolean', 'string', 'float', 'array', 'object']

const DefaultInput = ({
  valueType,
  initialValue,
  onChange,
  choices = [],
  showChoices = false,
}) => {
  // determine fallback value based on type
  if (valueType === 'boolean') {
    initialValue = initialValue || false
  } else if (valueType === 'number') {
    initialValue = initialValue || 0
  } else if (valueType === 'float') {
    initialValue = initialValue || 0.0
  } else if (valueType === 'integer') {
    initialValue = initialValue || 0
  } else if (valueType === 'string') {
    initialValue = initialValue || ''
  } else if (valueType === 'array') {
    initialValue = initialValue || '[]'
  } else if (valueType === 'object') {
    initialValue = initialValue || '{}'
  } else if (showChoices && choices.length > 0) {
    initialValue = choices[0].value
  } else {
    initialValue = ''
  }

  const [value, setValue] = useState(initialValue)

  const updateValue = value => {
    setValue(value)
    onChange(value)
  }

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return (
    <div className="w-full justify-start flex">
      {showChoices && (
        <>
          <Select onValueChange={updateValue} defaultValue={value}>
            <SelectTrigger className="w-[180px]">
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
        </>
      )}
      {valueType === 'string' && !showChoices && (
        <Input
          type="text"
          className={inputClass}
          value={value || ''}
          onChange={e => {
            updateValue(e.currentTarget.value)
          }}
        />
      )}
      {valueType === 'float' && !showChoices && (
        <Input
          type="number"
          className={inputClass}
          value={value || 0}
          onChange={e => updateValue(e.currentTarget.value)}
        />
      )}
      {valueType === 'integer' && !showChoices && (
        <Input
          type="number"
          className={inputClass}
          value={value || 0}
          onChange={e => updateValue(e.currentTarget.value)}
        />
      )}
      {valueType === 'boolean' && !showChoices && (
        <div className="flex gap-2 h-10 items-center">
          <p>True</p>
          <Switch value={value || 0} onChange={updateValue} />
          <p>False</p>
        </div>
      )}
      {valueType === 'array' && !showChoices && (
        <Input disabled className={inputClass} value="[]" />
      )}
      {valueType === 'object' && !showChoices && (
        <Input disabled className={inputClass} value="{}" />
      )}
    </div>
  )
}

type VariableProps = {
  variable: VariableJSON
  updateVariable: (variable: VariableJSON) => void
  deleteVariable: (variableId: string) => void
}

export const Variable = ({
  variable,
  updateVariable,
  deleteVariable,
}: VariableProps) => {
  const updateProperty = (property: keyof VariableJSON) =>
    debounce(value => {
      updateVariable({
        ...variable,
        [property]: value,
      })
    }, 500)

  return (
    <div className="border-b-2 border-b-solid border-b-[var(--background-color)] mb-2 p-2 pl-4">
      <div className="flex flex-row">
        <div className="flex flex-col w-full gap-2">
          <div className="flex flex-row mb2 gap-2 w-full">
            <div className="flex-grow">
              <p>Name</p>
              <Input
                disabled
                className={inputClass}
                value={variable.name}
                onChange={e => updateProperty('name')(e.target.value)}
              />
            </div>

            <div className="flex-grow">
              <Label>Type</Label>
              <Select
                onValueChange={updateProperty('valueTypeName')}
                defaultValue={variable.valueTypeName}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {valueTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="w-full">
            <p>Default value</p>
            <DefaultInput
              valueType={variable.valueTypeName}
              initialValue={variable.initialValue}
              onChange={updateProperty('initialValue')}
            />
          </div>
        </div>
        <div className="flex items-center px-2 pl-4">
          <TrashIcon
            className="h-6 w-6 cursor-pointer hover:text-sky-300 transition-all duration-200 ease-in-out"
            onClick={() => deleteVariable(variable.id)}
          />
        </div>
      </div>
    </div>
  )
}
