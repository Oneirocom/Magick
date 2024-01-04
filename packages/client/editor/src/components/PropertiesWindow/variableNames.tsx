import { cx } from "class-variance-authority";
import { ConfigurationComponentProps } from "./PropertiesWindow";
import { useCallback, useEffect, useState } from "react";
import { VariableJSON } from "@magickml/behave-graph";
import { useReactFlow } from "reactflow";

const inputClass = cx(
  'bg-gray-600 disabled:bg-gray-700 w-full py-1 px-2 nodrag text-md justify-start flex',
);

export const VariableNames = ({ spell, fullConfig, updateConfigKeys }: ConfigurationComponentProps) => {
  const { variableId, socketInputs, socketOutputs } = fullConfig
  const [selectedVariable, setSelectedVariable] = useState<VariableJSON>(null)
  const reactFlow = useReactFlow()

  const setEdges = useCallback((edges) => {
    const filtered = edges.filter(edge => edge.sourceHandle !== selectedVariable?.name && edge.targetHandle !== selectedVariable?.name)

    return filtered
  }, [selectedVariable])

  useEffect(() => {
    if (!spell && !fullConfig) return

    const variable = spell.graph.variables.find(variable => variable.id === variableId)
    if (!variable) return
    setSelectedVariable(variable)
  }, [spell, fullConfig])

  const updateValue = (value) => {
    const variable = spell.graph.variables.find(variable => variable.id === value) as VariableJSON

    reactFlow.setEdges(setEdges)

    setSelectedVariable(variable)
  }

  useEffect(() => {
    if (!selectedVariable) return
    if (selectedVariable.id === variableId) return
    const socket = {
      name: selectedVariable.name,
      valueType: selectedVariable.valueTypeName
    }

    const configUpdate = {
      variableId: selectedVariable.id,
      label: selectedVariable.name
    }

    if (socketInputs) {
      configUpdate['socketInputs'] = [socket]
    }

    if (socketOutputs) {
      configUpdate['socketOutputs'] = [socket]
    }

    updateConfigKeys(configUpdate)
  }, [selectedVariable])


  if (!spell) return null;

  return (
    <div>
      <select
        className={inputClass}
        value={selectedVariable?.id || 'default'}
        onChange={(e) => updateValue(e.currentTarget.value)}
      >
        <>
          <option disabled selected value="default">Select a variable</option>
          {(spell.graph.variables as VariableJSON[]).map((variable) => (
            <option key={variable.id} value={variable.id}>
              {variable.name}
            </option>
          ))}
        </>
      </select>
    </div>
  );
}