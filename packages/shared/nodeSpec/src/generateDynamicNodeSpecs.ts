import { NodeSpecJSON, Variable, VariableJSON } from '@magickml/behave-graph'
import { SpellInterface } from 'server/schemas'

type ConfigUpdate = {
  variableId: string
  label: string
  valueTypeName: string
} & SocketUpdate

type SocketUpdate = {
  label: string
  socketInputs?: { name: string; valueType: string }[]
  socketOutputs?: { name: string; valueType: string }[]
}

export const getVariableConfig = (
  variable: VariableJSON,
  configuration: Record<string, any>,
  type?: 'get' | 'set' | 'on'
): ConfigUpdate => {
  const socketInputs = configuration.socketInputs
  const socketOutputs = configuration.socketOutputs

  const socket = {
    name: variable.name,
    valueType: variable.valueTypeName,
  }

  const configUpdate: ConfigUpdate = {
    variableId: variable.id,
    valueTypeName: variable.valueTypeName,
    label: variable.name,
  }

  if (socketInputs) {
    configUpdate.socketInputs = [socket]
  }

  if (socketOutputs) {
    configUpdate.socketOutputs = [socket]
  }

  if (type === 'on') {
    configUpdate['socketOutputs'] = [
      socket,
      {
        name: 'lastValue',
        valueType: variable.valueTypeName,
      },
    ]
  }

  return configUpdate
}

export const getInputOutputConfig = (
  configuration: Record<string, any>,
  sockets: { name: string; valueType: string }[],
  type: 'input' | 'output'
): SocketUpdate => {
  const configUpdate: SocketUpdate = {
    label: capitalize(type),
  }

  if (type === 'input') {
    configUpdate.socketOutputs = sockets
  } else {
    configUpdate.socketInputs = sockets
  }

  return configUpdate
}

function capitalize(string: string) {
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
  type: 'get' | 'set' | 'on'
): NodeSpecJSON {
  const newSpec = updateDefaultValues(
    variableSpec,
    getVariableConfig(variable, variableSpec)
  )
  newSpec.label = `${capitalize(type)} ${capitalize(variable.name)}`
  newSpec.type = `variables/${type}/${variable.name}`
  return newSpec
}

function createInputOutputNodeSpec(
  baseSpec: NodeSpecJSON,
  sockets: { name: string; valueType: string }[],
  type: 'input' | 'output'
): NodeSpecJSON {
  const newSpec = updateDefaultValues(
    baseSpec,
    getInputOutputConfig(baseSpec, sockets, type)
  )
  newSpec.label = `${capitalize(type)} Sockets`
  newSpec.type = `event/subspells/${type}`
  return newSpec
}

function configurationArrayToObject(
  configuration: { name: string; defaultValue: any }[]
): Record<string, any> {
  return configuration.reduce((obj, item) => {
    obj[item.name] = item.defaultValue
    return obj
  }, {} as Record<string, any>)
}

export const generateVariableNodeSpecs = (
  allSpecs: NodeSpecJSON[],
  spell: SpellInterface
) => {
  const getVariableSpec = allSpecs.find(spec => spec.type === 'variables/get')
  const setVariableSpec = allSpecs.find(spec => spec.type === 'variables/set')
  const onVariableSpec = allSpecs.find(spec => spec.type === 'variables/on')
  const inputEventSpec = allSpecs.find(
    spec => spec.type === 'event/subspells/input'
  )
  const outputEventSpec = allSpecs.find(
    spec => spec.type === 'event/subspells/output'
  )

  console.log('on variable spec', onVariableSpec)

  if (
    !getVariableSpec ||
    !setVariableSpec ||
    !onVariableSpec ||
    !inputEventSpec ||
    !outputEventSpec
  ) {
    return []
  }

  const getConfiguration = configurationArrayToObject(
    getVariableSpec.configuration
  )
  const setConfiguration = configurationArrayToObject(
    setVariableSpec.configuration
  )
  const onConfiguration = configurationArrayToObject(
    onVariableSpec.configuration
  )

  const variableNodeSpecs = spell.graph.variables
    .map((variable: Variable) => {
      const getSpec = updateDefaultValues(
        getVariableSpec,
        getVariableConfig(variable, getConfiguration)
      )
      const setSpec = updateDefaultValues(
        setVariableSpec,
        getVariableConfig(variable, setConfiguration)
      )
      const onSpec = updateDefaultValues(
        onVariableSpec,
        getVariableConfig(variable, onConfiguration, 'on')
      )

      const getSpecJSON = createVariableNodeSpec(getSpec, variable, 'get')
      const setSpecJSON = createVariableNodeSpec(setSpec, variable, 'set')
      const onSpecJSON = createVariableNodeSpec(onSpec, variable, 'on')

      return [getSpecJSON, setSpecJSON, onSpecJSON]
    })
    .flat()

  const inputSockets =
    spell.graph.graphInputs?.map(input => ({
      name: input.key,
      valueType: input.valueType,
    })) || []

  const outputSockets =
    spell.graph.graphOutputs?.map(output => ({
      name: output.key,
      valueType: output.valueType,
    })) || []

  const inputSpecJSON = createInputOutputNodeSpec(
    inputEventSpec,
    inputSockets,
    'input'
  )
  const outputSpecJSON = createInputOutputNodeSpec(
    outputEventSpec,
    outputSockets,
    'output'
  )

  return [...variableNodeSpecs, inputSpecJSON, outputSpecJSON]
}

export const sortNodeSpecsByType = (
  a: { type: string },
  b: { type: string }
) => {
  if (a.type < b.type) {
    return -1
  }
  if (a.type > b.type) {
    return 1
  }
  return 0
}
