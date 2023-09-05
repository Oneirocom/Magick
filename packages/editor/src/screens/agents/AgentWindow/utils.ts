export interface NodeData {
    /** Indicates if the node data is public. */
    isPublic?: boolean;
    /** The name of the node. */
    name?: string;
    /** Fewshot data. */
    fewshot?: string;
    /** Variable value which can be string or boolean. */
    _var?: string | boolean;
    /** Success state of the node. */
    success?: boolean;
    /** Key for the socket. */
    socketKey?: string;
    /** Error state of the node. */
    error?: boolean;
    /** Indicates if the node is an output. */
    isOutput?: boolean;
    /** Type of the output. */
    outputType?: string;
    /** Indicates if the node should be sent to playtest. */
    sendToPlaytest?: boolean;
  }
  
  export interface Node {
    /** The identifier for the node. */
    id: number;
    /** Data associated with the node. */
    data: NodeData;
  }
  
  export interface Graph {
    /** Collection of nodes indexed by their id. */
    nodes: Record<number, Node>;
  }
  
  export interface JSONStructure {
    /** Represents the graph structure. */
    graph: Graph;
  }
  
  export type VarType = 'string' | 'text' | 'boolean';
  
  export type NodeDataWithType = NodeData & {
    /** The type of the variable (string/text/boolean). */
    type: VarType;
    /** Value if the type is boolean. */
    boolValue?: boolean;
    /** Value if the type is string or text. */
    stringValue?: string;
  };
  
/**
 * Extracts public variables from a given JSON structure.
 *
 * @param json - The JSON structure containing nodes with public variable data.
 * @returns An array of node data with type annotations (string, text, or boolean).
 */
export function extractPublicVariables(
    json: JSONStructure
  ): NodeDataWithType[] {
    const nodes = Object.values(json.graph.nodes);
  
    return nodes
      .filter((node) => node.data?.isPublic)
      .map((node) => mapNodeDataToType(node.data));
  }
  
  /**
   * Maps the node data to its corresponding type.
   *
   * @param data - Node data to be mapped to its type.
   * @returns Mapped node data with its type.
   */
  function mapNodeDataToType(data: NodeData): NodeDataWithType {
    if (data.fewshot) {
      return { ...data, type: 'text', stringValue: data.fewshot };
    }
    if (isBoolean(data._var)) {
      return { ...data, type: 'boolean', boolValue: data._var };
    }
    return { ...data, type: 'string', stringValue: String(data._var) };
  }
  
  /**
   * Type guard to verify if a value is boolean.
   *
   * @param value - Value to be checked for its type.
   * @returns True if the value is of boolean type, false otherwise.
   */
  function isBoolean(value: string | boolean | undefined): value is boolean {
    return typeof value === 'boolean';
  }