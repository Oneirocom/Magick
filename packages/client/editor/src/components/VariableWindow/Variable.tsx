import { VariableJSON } from "@magickml/behave-graph";
import { cx } from "class-variance-authority";
import { Icon } from "client/core";
import { debounce } from "lodash";
import { useEffect, useState } from "react";

const inputClass = cx(
  'bg-gray-600 disabled:bg-gray-700 w-full py-1 px-2 nodrag text-md justify-start flex',
);

// todo we need to centralize these types
const valueTypes = [
  'boolean',
  'number',
  'string',
  'float',
  'array',
  'object'
]

const DefaultInput = ({ valueType, initialValue, onChange, choices = [], showChoices = false }) => {
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
    initialValue = initialValue || ""
  } else if (valueType === 'array') {
    initialValue = initialValue || "[]"
  } else if (valueType === 'object') {
    initialValue = initialValue || "{}"
  } else if (showChoices && choices.length > 0) {
    initialValue = choices[0].value
  } else {
    initialValue = ""
  }

  const [value, setValue] = useState(initialValue)

  const updateValue = (value) => {
    setValue(value)
    onChange(value)
  }

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])


  return (
    <div className="w-full justify-start flex">
      {showChoices && (
        <select
          className={inputClass}
          value={value || choices[0].value}
          onChange={(e) => updateValue(e.currentTarget.value)}
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
          value={value || ""}
          onChange={(e) => {
            updateValue(e.currentTarget.value)
          }}
        />
      )}
      {valueType === 'number' && !showChoices && (
        <input
          type="number"
          className={inputClass}
          value={value || 0}
          onChange={(e) => updateValue(e.currentTarget.value)}
        />
      )}
      {valueType === 'float' && !showChoices && (
        <input
          type="number"
          className={inputClass}
          value={value || 0}
          onChange={(e) => updateValue(e.currentTarget.value)}
        />
      )}
      {valueType === 'integer' && !showChoices && (
        <input
          type="number"
          className={inputClass}
          value={value || 0}
          onChange={(e) => updateValue(e.currentTarget.value)}
        />
      )}
      {valueType === 'boolean' && !showChoices && (
        <input
          type="checkbox"
          className={inputClass + ' mr-auto justify-start flex order-first'}
          value={value || 0}
          onChange={(e) => updateValue(e.currentTarget.checked)}
        />
      )}
      {valueType === 'array' && !showChoices && (
        <input
          disabled
          className={inputClass}
          value="[]"
        />
      )}
      {valueType === 'object' && !showChoices && (
        <input
          disabled
          className={inputClass}
          value="{}"
        />
      )}
    </div>
  )
}

type VariableProps = {
  variable: VariableJSON
  updateVariable: (variable: VariableJSON) => void
  deleteVariable: (variableId: string) => void
}


export const Variable = ({ variable, updateVariable, deleteVariable }: VariableProps) => {

  const updateProperty = (property: keyof VariableJSON) => debounce((value) => {
    updateVariable({
      ...variable,
      [property]: value,
    })
  }, 500)

  return (
    <div className="border-b-2 border-b-solid border-b-[var(--background-color)] mb-2">
      <div className="flex px-2 pl-4">
        <div className="flex flex-column mb2 py-2 gap-2 w-full">
          <div className="flex">
            <p className="w-2/5">Name</p>
            <input
              className={inputClass}
              value={variable.name}
              onChange={(e) => {
                updateProperty('name')(e.target.value)
              }}
            />
          </div>
          <div className="flex">
            <p className="w-2/5">Type</p>
            <select
              className={inputClass}
              value={variable.valueTypeName}
              onChange={(e) => {
                updateProperty('valueTypeName')(e.target.value)
              }}
            >
              <>
                {valueTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </>
            </select>
          </div>
          <div className="flex">
            <p className="w-2/5">Defult value</p>
            <DefaultInput
              valueType={variable.valueTypeName}
              initialValue={variable.initialValue}
              onChange={updateProperty('initialValue')}
            />
          </div>

        </div>
        {/*  button in a flex comtainer centered vertically for trash delete */}
        <div className="flex items-center px-4">
          <Icon name="trash" size={16} onClick={() => {
            deleteVariable(variable.id)
          }} />
        </div>
      </div>
    </div>
  )
}