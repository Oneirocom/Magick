import type { NodeDefinition } from "@magickml/behave-graph";

// This is a mock of our existing system
class NodeRegistry {
  private definitions: Record<string, NodeDefinition> = {};

  register(definition: NodeDefinition) {
    this.definitions[definition.typeName] = definition;
  }

  unregister(typeName: string) {
    delete this.definitions[typeName];
  }

  get(typeName: string): NodeDefinition | undefined {
    return this.definitions[typeName];
  }

  getAll(): Record<string, NodeDefinition> {
    return { ...this.definitions };
  }
}

export const nodeRegistry = new NodeRegistry();