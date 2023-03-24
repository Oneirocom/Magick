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
    rootSpell: Type.Optional(spellSchema),
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
