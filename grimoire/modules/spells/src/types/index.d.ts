import type { GraphJSON, GraphInstance } from '@magickml/behave-graph';

export interface Spell {
  id: string;
  name: string;
  description?: string;
  graph: GraphInstance;
}

export interface SerializedSpell {
  id: string;
  name: string;
  description?: string;
  graph: GraphJSON;
}

export interface SpellRegistry {
  get: (id: string) => Spell | undefined;
  getAll: () => Spell[];
  add: (spell: Spell) => void;
  remove: (id: string) => void;
  update: (id: string, spell: Partial<Spell>) => void;
}

declare module 'nitro/types' {
  interface NitroApp {
    spellRegistry: SpellRegistry;
  }
}

