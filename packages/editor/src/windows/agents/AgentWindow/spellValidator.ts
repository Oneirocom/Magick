import Ajv from 'ajv';

interface Node {
  id: number;
  data: {
    name: string | null;
    text?: {
      inputs?: {
        [key: string]: {
          type: string;
          [key: string]: any;
        }
      } | null;
    } | null;
    isInput: boolean | null;
    [key: string]: any;
  } | null;
  inputs: {
    [key: string]: {
      connections: Array<{
        node: number;
        input: string;
        data: {
          [key: string]: any;
        } | null;
      }> | null;
    } | null;
  } | null;
  outputs: {
    [key: string]: {
      connections: Array<{
        node: number;
        input: string;
        data: {
          [key: string]: any;
        } | null;
      }> | null;
    } | null;
  } | null;
  position: [number, number] | null;
  name: string | null;
}

interface Graph {
  id: string;
  nodes: {
    [key: string]: Node | null;
  };
}

interface SpellData {
  id: string;
  name: string;
  projectId: string;
  hash: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  graph: Graph;
}

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
      position: { type: ['array', 'null'], items: [{ type: 'number' }, { type: 'number' }] },
      name: { type: ['string', 'null'] },
    },
  };
  

type Data = {
    [key: string]: boolean;
  };
  
  const inputTypeMapping: { [key: string]: Set<string> } = {
    discord_enabled: new Set(['Discord (Voice)', 'Discord (Text)']),
    rest_enabled: new Set(['REST API (GET)', 'REST API (POST)', 'REST API (PUT)', 'REST API (DELETE)']),
    twitter_enabled: new Set(['Twitter (Feed)']),
    loop_enabled: new Set(['Loop In']),
  };
  
  const validateNodes = (nodes: { [key: string]: Node | null }, data: Data = {}): boolean => {
    const nodesArray = Object.values(nodes).filter((n) => n !== null) as Node[];
    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile(schema);

    // Check if each node in nodesArray has a valid schema
    for (const node of nodesArray) {
        const valid = validate(node);
        if (!valid) {
        console.error(validate.errors);
        return false;
        }
    }

    //@ts-ignore
    const enabledInputs = data.map(ele => ele.name)
    console.log(enabledInputs)
    // Check if each node with isInput true has a data object with a name property
    // that matches at least one of the input types specified in the data object
    for (const node of nodesArray) {
        if (node.data?.isInput === true && node.data?.name) {
            const inputMatch = /Input - (.*)/.exec(node.data.name);
            if (!inputMatch || enabledInputs.includes(inputMatch[1])) {
                return true;
            }
        }
    }
    return false;
  };

const validateSpellData = (spellData: SpellData | null, data: any): boolean => {
  if (!spellData || !spellData.graph) {
    return true;
  }

  if (!spellData.graph.nodes) return false
  return validateNodes(spellData.graph.nodes, data);
};

export default validateSpellData