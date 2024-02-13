import { useEffect, useState } from 'react'
import { VariableJSON } from '@magickml/behave-graph'
import { ConfigurationComponentProps } from './PropertiesWindow'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@magickml/client-ui'

export const VariableNames = ({
  spell,
  fullConfig,
  updateConfigKeys,
  node,
}: ConfigurationComponentProps) => {
  const [selectedVariable, setSelectedVariable] = useState<VariableJSON | null>(
    null
  )

  useEffect(() => {
    if (spell && fullConfig) {
      const variable = spell.graph.variables.find(
        variable => variable.id === fullConfig.variableId
      )
      setSelectedVariable(variable || null)
    }
  }, [spell, fullConfig])

  const updateValue = (variableId: string) => {
    const variable = spell.graph.variables.find(
      variable => variable.id === variableId
    ) as VariableJSON

    if (variable) {
      setSelectedVariable(variable)

      const socket = {
        name: variable.name,
        valueType: variable.valueTypeName,
      }

      const configUpdate: Record<string, any> = {
        variableId: variable.id,
        label: variable.name,
      }

      if (fullConfig.socketInputs) {
        configUpdate['socketInputs'] = [socket]
      }

      if (fullConfig.socketOutputs) {
        configUpdate['socketOutputs'] = [socket]
      }

      updateConfigKeys(configUpdate)
    }
  }

  if (!spell) return null

  return (
    <div>
      <label htmlFor="variable">Select a variable</label>
      <Select value={selectedVariable?.id || ''} onValueChange={updateValue}>
        <SelectTrigger>
          <SelectValue placeholder="Select a variable" />
        </SelectTrigger>
        <SelectContent>
          {spell.graph.variables.map((variable: VariableJSON) => (
            <SelectItem key={variable.id} value={variable.id}>
              {variable.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
