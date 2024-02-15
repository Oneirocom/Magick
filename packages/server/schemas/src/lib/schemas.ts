// DOCUMENTED
import { Static, Type } from '@feathersjs/typebox'

/**
 * Full data model schema for a spell.
 *
 * @property {string} id - The spell's ID.
 * @property {string} projectId - The ID of the project that the spell belongs to.
 * @property {string} name - The name of the spell.
 * @property {string} [type] - The type of the spell (optional).
 * @property {object} graph - The spell's graph object.
 * @property {string} graph.id - The ID of the spell's graph.
 * @property {any} graph.nodes - The nodes of the spell's graph.
 * @property {string} [spellReleaseId] - The ID of the spell's spell release record(optional).
 * @property {string} [createdAt] - The date when the spell was created (optional).
 * @property {string} [updatedAt] - The date when the spell was last updated (optional).
 */
export const spellSchema = Type.Object(
  {
    id: Type.String(),
    projectId: Type.String(),
    name: Type.String(),
    type: Type.Optional(Type.String()),
    graph: Type.Object({
      id: Type.Optional(Type.String()),
      values: Type.Optional(Type.Any()),
      variables: Type.Optional(Type.Any()),
      nodes: Type.Any(), // TODO: add magick node schema validation
    }),
    spellReleaseId: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    createdAt: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    updatedAt: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  },
  {
    $id: 'Spell',
    additionalProperties: false,
  }
)

/** The interface for a spell object that's based on the `spellSchema`. */
export type SpellInterface = Static<typeof spellSchema>

/**
 * Full data model schema for an agent.
 *
 * @property {string} id - The agent's ID.
 * @property {string} projectId - The ID of the project that the agent belongs to.
 * @property {string} name - The name of the agent.
 * @property {boolean} [enabled] - Whether the agent is enabled or not (optional).
 * @property {string} runState - The run state of the agent.
 * @property {string} updatedAt - The date when the agent was last updated.
 * @property {string} [pingedAt] - The date when the agent was last pinged (optional).
 * @property {any} [data] - The data stored in the agent (optional).
 * @property {any} [publicVariables] - The public variables of the agent (optional).
 * @property {string} [secrets] - The secrets of the agent (optional).
 * @property {string} [image] - The image of the agent (optional).
 */
export const agentSchema = Type.Object(
  {
    id: Type.String(),
    projectId: Type.String(),
    rootSpellId: Type.Optional(Type.String() || Type.Null()),
    name: Type.String(),
    enabled: Type.Optional(Type.Boolean()),
    runState: Type.Optional(Type.String()), // TODO: THe database restricts this to a set of values, but we don't have a way to express that in typebox afaik
    updatedAt: Type.Optional(Type.String() || Type.Null()),
    createdAt: Type.Optional(Type.String() || Type.Null()),
    pingedAt: Type.Optional(Type.String()),
    data: Type.Optional(Type.Any()),
    publicVariables: Type.Optional(Type.Any()),
    secrets: Type.Optional(Type.String()),
    frozen: Type.Optional(Type.Boolean()),
    default: Type.Optional(Type.Boolean()),
    version: Type.String(),
    currentSpellReleaseId: Type.Optional(
      Type.Union([Type.Null(), Type.String()])
    ),
    isDraft: Type.Optional(Type.Boolean()),
    embedModel: Type.Optional(Type.Union([Type.Null(), Type.String()])), // DEPRECATED
    rootSpell: Type.Optional(Type.Union([Type.Null(), Type.String()])), // DEPRECATED
    image: Type.Optional(Type.Union([Type.Null(), Type.String()])), // DEPRECATED
  },
  {
    $id: 'Agent',
    additionalProperties: false,
  }
)

/** The type for an agent object that's based on the `agentSchema`. */
export type AgentSchema = Static<typeof agentSchema>
/** The interface for an agent object that's based on the `agentSchema`. */
export type AgentInterface = AgentSchema

/**
 * Full data model schema for a document.
 *
 * @property {string} id - The document's ID.
 * @property {string} [type] - The type of the document (optional).
 * @property {string} [content] - The content of the document (optional).
 * @property {string} projectId - The ID of the project that the document belongs to.
 * @property {string} [date] - The date when the document was created (optional).
 * @property {any} [embedding] - The embedding data of the document (optional).
 * @property {any} [metadata] - The embedding data of the document (optional).
 */
export const documentSchema = Type.Object(
  {
    id: Type.String(),
    type: Type.Optional(Type.String()),
    fileType: Type.Optional(Type.String()),
    content: Type.Optional(Type.String()),
    projectId: Type.String(),
    agentId: Type.Optional(Type.String()),
    date: Type.Optional(Type.String()),
    embedding: Type.Optional(Type.Any()),
    metadata: Type.Optional(Type.Any()),
    files: Type.Optional(Type.Any()),
  },
  {
    $id: 'Document',
    additionalProperties: false,
  }
)

/**
 * Full data model schema for a document.
 *
 * @property {string} id - The document's ID.
 * @property {string} [type] - The type of the document (optional).
 * @property {string} [content] - The content of the document (optional).
 * @property {string} projectId - The ID of the project that the document belongs to.
 * @property {string} [date] - The date when the document was created (optional).
 * @property {any} [embedding] - The embedding data of the document (optional).
 * @property {any} [metadata] - The embedding data of the document (optional).
 */
export const knowledgeSchema = Type.Object(
  {
    id: Type.String(),
    projectId: Type.String(),
    name: Type.String(),
    type: Type.Optional(Type.String()),
    dataType: Type.Optional(Type.String()),
    sourceUrl: Type.Optional(Type.String()),
    updatedAt: Type.Optional(Type.String() || Type.Null()),
    createdAt: Type.Optional(Type.String() || Type.Null()),
    metadata: Type.Optional(Type.Any()),
    memoryId: Type.String(),
  },
  {
    $id: 'Knowledge',
  }
)

/** The interface for a document object that's based on the `documentSchema`. */
export type Document = Static<typeof documentSchema>

export const spellReleaseSchema = Type.Object(
  {
    id: Type.String(),
    description: Type.String(),
    agentId: Type.Optional(Type.String()), // An agent will typically run the release which batches many spell releases
    spellId: Type.Optional(Type.String()), // A spell may in theory be release by the spell service
    createdAt: Type.String(),
    projectId: Type.String(),
    agentToCopyId: Type.Optional(Type.String()),
  },
  {
    $id: 'SpellRelease',
    additionalProperties: false,
  }
)

/** The type for an agent object that's based on the `agentSchema`. */
export type SpellReleaseSchema = Static<typeof spellReleaseSchema>
/** The interface for an agent object that's based on the `agentSchema`. */
export type SpellReleaseInterface = SpellReleaseSchema

export enum Duration {
  once = 'once',
  daily = 'daily',
  weekly = 'weekly',
  monthly = 'monthly',
  yearly = 'yearly',
}
/**
 * Budget schema for defining the structure of budget data
 * @property {string} id - The budget's ID.
 * @property {string} agent_id - The ID of the agent that the budget belongs to.
 * @property {number} total_budget - The total budget of the agent.
 * @property {number} current_cost - The current cost of the agent.
 * @property {string} duration - The duration of the budget.
 * @property {string} created_at - The date when the budget was created.
 * @property {string} updated_at - The date when the budget was last updated.
 * @property {string} status - The status of the budget.
 * @property {string} reset_at - The date when the budget was last reset.
 * @property {number} alert_threshold - The alert threshold of the budget.
 * @property {string} alerted_at - The date when the budget was last alerted.
 * @property {string} alert_frequency - The alert frequency of the budget.
 * @property {string} notes - The notes of the budget.
 */
export const budgetSchema = Type.Object(
  {
    id: Type.Optional(Type.String({ format: 'uuid' })), // Auto-generated by the database
    agent_id: Type.String({ format: 'uuid' }),
    total_budget: Type.Number(),
    current_cost: Type.Number({ default: 0 }), // Default value set to 0
    duration: Type.String({ enum: ['daily', 'weekly', 'monthly', 'yearly'] }),
    created_at: Type.Optional(Type.String({ format: 'date-time' })), // Auto-set by the database
    updated_at: Type.Optional(
      Type.String({ format: 'date-time', default: new Date().toISOString() })
    ),
    status: Type.Optional(
      Type.String({ enum: ['active', 'paused', 'expired'], default: 'active' })
    ),
    reset_at: Type.Optional(Type.String({ format: 'date-time' })),
    alert_threshold: Type.Optional(Type.Number({ default: 0.75 })),
    alerted_at: Type.Optional(Type.String({ format: 'date-time' })),
    alert_frequency: Type.Optional(
      Type.String({
        enum: ['once', 'daily', 'weekly', 'monthly', 'yearly'],
        default: 'daily',
      })
    ),
    notes: Type.Optional(Type.String({ default: '' })),
  },
  { $id: 'Budget' }
)

export const userSchema = Type.Object(
  {
    id: Type.String(),
    email: Type.String(),
    name: Type.Optional(Type.String()),
    balance: Type.Number(),
    promoCredit: Type.Number(),
    introCredit: Type.Number(),
    hasSubscription: Type.Boolean(),
    subscriptionName: Type.Optional(Type.String()),
    projectId: Type.Optional(Type.String()),
  },
  {
    $id: 'User',
  }
)

/** The type for an agent object that's based on the `agentSchema`. */
export type UserSchema = Static<typeof userSchema>
/** The interface for an agent object that's based on the `agentSchema`. */
export type UserInterface = UserSchema
