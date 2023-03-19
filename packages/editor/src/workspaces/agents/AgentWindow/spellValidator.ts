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
    const ajv = new Ajv();
    const validate = ajv.compile({ type: 'array', items: schema });
    const nodesArray = Object.values(nodes).filter((n) => n !== null) as Node[];
    const inputRegex = /^Input - (.+)$/;
  
    let inputTypeSet: Set<string> = new Set([
      'Default',
    ]);
  
    
    if (data) {
        console.log(data)
        inputTypeSet = new Set(['Default']);
        for (const [key, value] of Object.entries(data)) {
            if (value && inputTypeMapping[key]) {
            const inputTypes = inputTypeMapping[key];
            inputTypes.forEach((inputType) => {
                inputTypeSet.add(inputType);
            });
            }
        }
    }
    //Rewrite Required for Multi Input, example Discord + REST
    //Presently would check if inputs in the spell have a match in array of inputs created from *-enabled property
    for (const node of nodesArray) {
      if (node.data?.isInput === true && node.data?.name) {
        const inputMatch = inputRegex.exec(node.data.name);
        if (!inputMatch || !inputTypeSet.has(inputMatch[1])) {
          return false;
        }
      }
    }
    try {
        let rsp = validate(nodesArray)
        console.log(validate.errors)
        return rsp
    } catch(e) {
        console.log(e)
        return false;
    }
  };

const validateSpellData = (spellData: SpellData | null, data: any): boolean => {
  if (!spellData) {
    return true;
  }
  return validateNodes(spellData.graph.nodes, data);
};

export default validateSpellData