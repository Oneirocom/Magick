import { VariableJSON } from '@magickml/behave-graph'
import { TrashIcon } from '@heroicons/react/24/outline'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
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
const valueTypes = ['boolean', 'string', 'float', 'array', 'object', 'integer']

const initialValueMap = {
  boolean: false,
  string: ' ',
  float: 0.0,
  integer: 0,
  array: '[]',
  object: '{}',
}

interface DefaultInputProps {
  valueType: string
  initialValue: any
  onChange: (value: any) => void
  choices?: { text: string; value: string }[]
  showChoices?: boolean
}

const DefaultInput = ({
  valueType,
  initialValue,
  onChange,
  choices = [],
  showChoices = false,
}: DefaultInputProps) => {
  // determine fallback value based on type
  if (valueType === 'boolean') {
    initialValue =
      initialValue !== undefined ? initialValue : initialValueMap.boolean
  } else if (valueType === 'number' || valueType === 'integer') {
    initialValue =
      initialValue !== undefined ? initialValue : initialValueMap.integer
  } else if (valueType === 'float') {
    initialValue =
      initialValue !== undefined ? initialValue : initialValueMap.float
  } else if (valueType === 'string') {
    initialValue =
      initialValue !== undefined ? initialValue : initialValueMap.string
  } else if (valueType === 'array') {
    initialValue =
      initialValue !== undefined ? initialValue : initialValueMap.array
  } else if (valueType === 'object') {
    initialValue =
      initialValue !== undefined ? initialValue : initialValueMap.object
  } else if (showChoices && choices.length > 0) {
    initialValue = choices[0].value
  } else {
    initialValue = ' '
  }

  const [value, setValue] = useState(initialValue)

  const updateValue = (value: any) => {
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
          value={value !== undefined ? value : 0}
          onChange={e => updateValue(parseFloat(e.currentTarget.value))}
        />
      )}
      {valueType === 'integer' && !showChoices && (
        <Input
          type="number"
          className={inputClass}
          value={value !== undefined ? value : ''}
          onChange={e => updateValue(parseInt(e.currentTarget.value, 10))}
        />
      )}
      {valueType === 'boolean' && !showChoices && (
        <div className="flex gap-2 h-10 items-center">
          <p>False</p>
          <Switch
            value={value}
            onCheckedChange={e => {
              updateValue(e)
            }}
          />
          <p>True</p>
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
  deleteAllVariableNodes: () => void
}

export const Variable = ({
  variable,
  updateVariable,
  deleteVariable,
  deleteAllVariableNodes,
}: VariableProps) => {
  const updateProperty = (property: keyof VariableJSON) => {
    return debounce((value: keyof typeof initialValueMap) => {
      if (property === 'valueTypeName') {
        deleteAllVariableNodes()
        console.log('update', {
          [property]: value,
          initialValue: initialValueMap[value],
        })
        updateVariable({
          ...variable,
          [property]: value,
          initialValue: initialValueMap[value],
        })
      } else {
        updateVariable({ ...variable, [property]: value })
      }
    }, 2000)
  }

  return (
    <Accordion
      type="single"
      collapsible
      className="border-b-2 border-b-solid border-b-[var(--background-color)] mb-2"
    >
      <AccordionItem value={variable.id}>
        <AccordionTrigger className="flex items-center justify-between w-full p-2 pl-4">
          <p>
            {variable.name} -{' '}
            <span className="text-stone-500">{variable.valueTypeName}</span>
          </p>
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-row p-2">
            <div className="flex flex-col w-full gap-2">
              <div className="flex flex-row mb2 gap-2 w-full">
                <div className="flex-grow">
                  <p>Name</p>
                  <Input
                    disabled
                    className={inputClass}
                    value={variable.name}
                    onChange={e =>
                      updateProperty('name')(
                        e.target.value as keyof typeof initialValueMap
                      )
                    }
                  />
                </div>

                <div className="flex-grow">
                  <Label>Type</Label>
                  <div className="my-2">
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
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
