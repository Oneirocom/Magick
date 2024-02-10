// DOCUMENTED
import Ajv from 'ajv'

/**
 * Interface representing the structure of a single node
 */
interface Node {
  id: number
  data: {
    name: string | null
    text?: {
      inputs?: {
        [key: string]: {
          type: string
          [key: string]: any
        }
      } | null
    } | null
    isInput: boolean | null
    [key: string]: any
  } | null
  inputs: {
    [key: string]: {
      connections: Array<{
        node: number
        input: string
        data: {
          [key: string]: any
        } | null
      }> | null
    } | null
  } | null
  outputs: {
    [key: string]: {
      connections: Array<{
        node: number
        input: string
        data: {
          [key: string]: any
        } | null
      }> | null
    } | null
  } | null
  position: [number, number] | null
  name: string | null
}

/**
 * Interface representing the structure of a graph
 */
interface Graph {
  id: string
  nodes: {
    [key: string]: Node | null
  }
}

/**
 * Interface representing the structure of spell data
 */
interface SpellData {
  id: string
  name: string
  projectId: string
  createdAt: string | null
  updatedAt: string | null
  graph: Graph
}

// Schema for validating nodes
const schema = {
  type: 'object',
  required: ['id', 'data'],
  properties: {
    id: { type: 'number' },
    data: {
      type: ['object', 'null'],
      properties: {
        name: { type: ['string', 'null'] },
        isInput: { type: ['boolean', 'null'] },
      },
    },
    inputs: { type: ['object', 'null'] },
    outputs: { type: ['object', 'null'] },
    position: {
      type: ['array', 'null'],
      items: [{ type: 'number' }, { type: 'number' }],
    },
    name: { type: ['string', 'null'] },
  },
}

type Data = {
  [key: string]: boolean
}

/**
 * Checks if given nodes are valid.
 *
 * @param nodes - An object containing nodes.
 * @param data - An object containing data.
 * @returns A boolean indicating the validity of the nodes.
 */
const validateNodes = (
  nodes: { [key: string]: Node | null },
  data: Data = {}
): boolean => {
  const nodesArray = Object.values(nodes).filter(n => n !== null) as Node[]
  const ajv = new Ajv({ allErrors: true })
  const validate = ajv.compile(schema)

  // Check if each node in nodesArray has a valid schema
  for (const node of nodesArray) {
    const valid = validate(node)
    if (!valid) {
      console.error(validate.errors)
      return false
    }
  }

  // Get enabledInputs from data object
  // const enabledInputs = Object.entries(data)
  // TODO: Reenable spell validation, right now its not working for Twitter
  // .filter(([, value]) => value)
  // .map(([key]) => inputTypeMapping[key])
  // .reduce((acc, inputSet) => {
  //   inputSet?.forEach((input) => acc.add(input));
  //   return acc;
  // }, new Set());

  // Check if each node with isInput true has a valid input type
  for (const node of nodesArray) {
    if (node.data?.isInput === true && node.data?.name) {
      const inputMatch = /Input - (.*)/.exec(node.data.name)
      if (!inputMatch /* || !enabledInputs.has(inputMatch[1])*/) {
        return false
      }
    }
  }
  return true
}

/**
 * Validates spell data.
 *
 * @param spellData - An object containing spell data or null.
 * @param data - An object containing data.
 * @returns A boolean indicating the validity of spell data.
 */
const validateSpellData = (spellData: SpellData | null, data: any): boolean => {
  if (!spellData || !spellData.graph) {
    return true
  }

  if (!spellData.graph.nodes) return false
  return validateNodes(spellData.graph.nodes, data)
}

export default validateSpellData
