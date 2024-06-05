import { useState } from 'react'
import { ConfigurationComponentProps } from './PropertiesWindow'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@magickml/client-ui' // Assuming this is the correct import path
import { setEdges } from 'client/state'
import { MagickEdgeType } from '@magickml/client-types'

export const ValueType = (props: ConfigurationComponentProps) => {
  const defaultValues = ['number', 'string', 'boolean']
  const { config, updateConfigKeys, fullConfig, node } = props
  const { valueTypeOptions: options, socketInputs, socketOutputs } = fullConfig
  const [configKey, configValue] = config
  const [valueType, setValueType] = useState(configValue || '')

  const handleValueTypeChange = (type: string) => {
    setValueType(type)

    const configUpdate: Record<string, any> = {
      [configKey]: type,
    }

    if (socketInputs) {
      configUpdate['socketInputs'] = [
        {
          name: options.socketName || 'Value',
          key: options.socketName || 'Value',
          valueType: type,
        },
      ]
    }

    if (socketOutputs) {
      configUpdate['socketOutputs'] = [
        {
          name: options.socketName || 'Value',
          key: options.socketName || 'Value',
          valueType: type,
        },
      ]
    }

    updateConfigKeys(configUpdate)

    // Disconnect any connected edges
    setEdges(props.tab.id, (edges: MagickEdgeType[]) => {
      return edges.filter(
        edge =>
          (edge.source !== node.id && edge.target !== node.id) ||
          edge.targetHandle === 'flow'
      )
    })
  }

  return (
    <div className="flex items-center">
      <label className="mr-2">Value Type</label>
      <Select value={valueType} onValueChange={handleValueTypeChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a value type" />
        </SelectTrigger>
        <SelectContent>
          {(options.values || defaultValues).map((type: string) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
