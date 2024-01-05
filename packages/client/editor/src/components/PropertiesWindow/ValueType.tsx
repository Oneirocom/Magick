import { useCallback, useState } from "react"
import { ConfigurationComponentProps } from "./PropertiesWindow"
import { cx } from "class-variance-authority";
import { useReactFlow } from "reactflow";

const inputClass = cx(
  'bg-gray-600 disabled:bg-gray-700 w-full py-1 px-2 nodrag text-md justify-start flex',
);


export const ValueType = (props: ConfigurationComponentProps) => {
  const defaultValues = ['number', 'string', 'boolean']
  const { config, updateConfigKeys, fullConfig } = props
  const { valueTypeOptions: options, socketInputs, socketOutputs } = fullConfig
  const [configKey, configValue] = config
  const [valueType, setValueType] = useState(configValue || '')

  const reactFlow = useReactFlow()

  const setEdges = useCallback((edges) => {
    const filtered = edges.filter(edge => edge.sourceHandle !== valueType && edge.targetHandle !== valueType)

    return filtered
  }
    , [valueType])

  const handleValueTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value
    setValueType(type)

    const configUpdate: Record<string, any> = {
      [configKey]: type
    }

    if (socketInputs) {
      configUpdate['socketInputs'] = [{
        name: options.socketName || 'Value',
        key: options.socketName || 'Value',
        valueType: type
      }]
    }

    if (socketOutputs) {
      configUpdate['socketOutputs'] = [{
        name: options.socketName || 'Value',
        key: options.socketName || 'Value',
        valueType: type
      }]
    }

    updateConfigKeys(configUpdate)

    reactFlow.setEdges(setEdges)
  }

  return (
    <div className="flex items-center">
      <label className="mr-2">Value Type</label>
      <select className={inputClass} value={valueType || 'default'} onChange={handleValueTypeChange}>
        <option disabled selected value="default">Select a value type</option>
        {(options.values || defaultValues).map(type => <option key={type} value={type}>{type}</option>)}
      </select>
    </div>
  )
}