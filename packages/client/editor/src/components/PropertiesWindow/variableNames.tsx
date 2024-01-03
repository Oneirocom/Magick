import { cx } from "class-variance-authority";
import { ConfigurationComponentProps } from "./PropertiesWindow";
import { useEffect, useState } from "react";
import { VariableJSON } from "@magickml/behave-graph";
import { useReactFlow } from "reactflow";

const inputClass = cx(
  'bg-gray-600 disabled:bg-gray-700 w-full py-1 px-2 nodrag text-md justify-start flex',
);

export const VariableNames = ({ spell, fullConfig, updateConfigKey }: ConfigurationComponentProps) => {
  const { variableId } = fullConfig
  const [selectedVariable, setSelectedVariable] = useState<VariableJSON>(null)
  const reactFlow = useReactFlow()

  useEffect(() => {
    if (!spell && !fullConfig) return

    const variable = spell.graph.variables.find(variable => variable.id === variableId)
    if (!variable) return
    setSelectedVariable(variable)
  }, [spell, fullConfig])

  useEffect(() => {
    if (!selectedVariable) return
    const variableSocket = {
      name: selectedVariable.name,
      valueType: selectedVariable.valueTypeName
    }
    updateConfigKey('socketOutputs', [variableSocket])
  }, [selectedVariable])

  const updateValue = (value) => {
    const variable = spell.graph.variables.find(variable => variable.id === value) as VariableJSON

    reactFlow.setEdges(edges => edges.filter(edge => edge.sourceHandle !== selectedVariable?.name))
    updateConfigKey('variableId', value)
    setSelectedVariable(variable)
  }

  if (!spell) return null;

  return (
    <div>
      <select
        className={inputClass}
        value={selectedVariable?.id || "select a variable"}
        onChange={(e) => updateValue(e.currentTarget.value)}
      >
        <>
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