import { NodeSpecJSON, VariableJSON } from '@magickml/behave-graph'
import { SpellInterface } from 'server/schemas'

type ConfigUpdate = {
  variableId: string
  label: string
  socketInputs?: { name: string; valueType: string }[]
  socketOutputs?: { name: string; valueType: string }[]
}

export const getVariableConfig = (
  variable: VariableJSON,
  configuraton: Record<string, any>
): ConfigUpdate => {
  const socketInputs = configuraton.socketInputs
  const socketOutputs = configuraton.socketOutputs

  const socket = {
    name: variable.name,
    valueType: variable.valueTypeName,
  }

  const configUpdate = {
    variableId: variable.id,
    label: variable.name,
  }

  if (socketInputs) {
    configUpdate['socketInputs'] = [socket]
  }

  if (socketOutputs) {
    configUpdate['socketOutputs'] = [socket]
  }

  return configUpdate
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function updateDefaultValues(
  nodeSpec: NodeSpecJSON,
  updates: { [key: string]: any }
): NodeSpecJSON {
  const updatedNodeSpec = { ...nodeSpec } // Shallow copy the nodeSpec object
  updatedNodeSpec.configuration = nodeSpec.configuration.map(configItem => {
    // If the current configItem's name is a key in the updates object, update the defaultValue
    if (updates.hasOwnProperty(configItem.name)) {
      return {
        ...configItem,
        defaultValue: updates[configItem.name],
      }
    }
    return configItem
  })
  return updatedNodeSpec
}

function createVariableNodeSpec(
  variableSpec: NodeSpecJSON,
  variable: VariableJSON,
  type: 'get' | 'set'
): NodeSpecJSON {
  const newSpec = updateDefaultValues(
    variableSpec,
    getVariableConfig(variable, variableSpec)
  )
  newSpec.label = `${capitalize(type)} ${capitalize(variable.name)}`
  newSpec.type = `variables/${type}/${variable.name}`
  return newSpec
}

function configurationArrayToObject(
  configuration: { name: string; defaultValue: any }[]
) {
  return configuration.reduce((obj, item) => {
    obj[item.name] = item.defaultValue
    return obj
  }, {})
}

export const generateVariableNodeSpecs = (
  allSpecs: NodeSpecJSON[],
  spell: SpellInterface
) => {
  const getVariableSpec = allSpecs.find(spec => spec.type === 'variables/get')
  const setVariableSpec = allSpecs.find(spec => spec.type === 'variables/set')

  const getConfiguration = configurationArrayToObject(
    getVariableSpec.configuration
  )
  const setConfiguration = configurationArrayToObject(
    setVariableSpec.configuration
  )

  const variableNodeSpecs = spell.graph.variables
    .map(variable => {
      console.log(
        'VARIABLE CONFIG',
        getVariableConfig(variable, getConfiguration)
      )
      const getSpec = updateDefaultValues(
        getVariableSpec,
        getVariableConfig(variable, getConfiguration)
      )
      const setSpec = updateDefaultValues(
        setVariableSpec,
        getVariableConfig(variable, setConfiguration)
      )

      const getSpecJSON = createVariableNodeSpec(getSpec, variable, 'get')
      const setSpecJSON = createVariableNodeSpec(setSpec, variable, 'set')

      return [getSpecJSON, setSpecJSON]
    })
    .flat()

  return variableNodeSpecs
}

export const sortNodeSpecsByType = (a, b) => {
  if (a.type < b.type) {
    return -1
  }
  if (a.type > b.type) {
    return 1
  }
  return 0
}
