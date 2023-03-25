import { Static, Type } from '@feathersjs/typebox'

// Main data model schema
export const spellSchema = Type.Object(
  {
    id: Type.String(),
    projectId: Type.String(),
    name: Type.String(),
    hash: Type.String(),
    graph: Type.Object({
      id: Type.String(),
      // TODO: add magick node schema validation
      nodes: Type.Any()
    }),
    createdAt: Type.Optional(Type.String()),
    updatedAt: Type.Optional(Type.String()),
  },
  { $id: 'Spell', additionalProperties: false }
)

export type SpellInterface = Static<typeof spellSchema>

// Main data model schema
export const agentSchema = Type.Object(
  {
    id: Type.String(),
    projectId: Type.String(),
    rootSpell: Type.Optional(Type.Any()),
    name: Type.String(),
    enabled: Type.Optional(Type.Boolean()),
    updatedAt: Type.String(),
    pingedAt: Type.Optional(Type.String()),
    spells: Type.Optional(Type.String()),
    data: Type.Optional(Type.Any()),
    publicVariables: Type.Optional(Type.Any()),
    secrets: Type.Optional(Type.String()),
  },
  { $id: 'Agent', additionalProperties: false }
)
export type Agent = Static<typeof agentSchema>
export type AgentInterface = Agent

export const documentSchema = Type.Object(
  {
    id: Type.String(),
    type: Type.Optional(Type.String()),
    owner: Type.Optional(Type.String()),
    content: Type.Optional(Type.String()),
    projectId: Type.String(),
    date: Type.Optional(Type.String()),
    embedding: Type.Optional(Type.Any()),
  },
  { $id: 'Document', additionalProperties: false }
)
export type Document = Static<typeof documentSchema>