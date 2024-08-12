import { type NodeDefinition } from '@magickml/behave-graph';

declare module 'nitro/types' {
  interface NitroApp {
    nodeRegistry: {
      register: (definition: NodeDefinition) => void;
      unregister: (typeName: string) => void;
      get: (typeName: string) => NodeDefinition | undefined;
      getAll: () => Record<string, NodeDefinition>;
    };
  }
}