import { NodeSpecJSON } from '@magickml/behave-graph'
import { socketsFromNumInputs } from './socketsFromNum'

const getPairs = <T, U>(arr1: T[], arr2: U[]) => {
  const max = Math.max(arr1.length, arr2.length)
  const pairs = []
  for (let i = 0; i < max; i++) {
    const pair: [T | undefined, U | undefined] = [arr1[i], arr2[i]]
    pairs.push(pair)
  }
  return pairs
}

export function configureSockets(
  data: Record<string, any>,
  spec: NodeSpecJSON
) {
  const { configuration: config } = data

  const configInputs = config?.socketInputs || []
  const numInputs = socketsFromNumInputs(config?.numInputs || 0)
  const numOutputs = socketsFromNumInputs(config?.numOutputs || 0)
  const configOutputs = config?.socketOutputs || []

  const inputs = [...spec.inputs, ...configInputs, ...numInputs]
  const outputs = [...spec.outputs, ...configOutputs, ...numOutputs]

  const flowInputs = inputs.filter(input => input.valueType === 'flow')
  const flowOutputs = outputs.filter(output => output.valueType === 'flow')

  const valueInputs = inputs.filter(input => input.valueType !== 'flow')
  const valueOutputs = outputs.filter(output => output.valueType !== 'flow')

  const pairs = getPairs(flowInputs, [...flowOutputs, ...valueOutputs])

  return { pairs, valueInputs, valueOutputs }
}
