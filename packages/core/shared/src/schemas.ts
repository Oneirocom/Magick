// DOCUMENTED
import { Static, Type } from '@feathersjs/typebox'

/**
 * Full data model schema for a spell.
 *
 * @property {string} id - The spell's ID.
 * @property {string} projectId - The ID of the project that the spell belongs to.
 * @property {string} name - The name of the spell.
 * @property {string} hash - The hash of the spell.
 * @property {object} graph - The spell's graph object.
 * @property {string} graph.id - The ID of the spell's graph.
 * @property {any} graph.nodes - The nodes of the spell's graph.
 * @property {string} [createdAt] - The date when the spell was created (optional).
 * @property {string} [updatedAt] - The date when the spell was last updated (optional).
 */
export const spellSchema = Type.Object(
  {
    id: Type.String(),
    projectId: Type.String(),
    name: Type.String(),
    hash: Type.String(),
    graph: Type.Object({
      id: Type.String(),
      nodes: Type.Any(), // TODO: add magick node schema validation
    }),
    createdAt: Type.Optional(Type.String()),
    updatedAt: Type.Optional(Type.String()),
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
    rootSpellId: Type.Optional(Type.String()),
    name: Type.String(),
    enabled: Type.Optional(Type.Boolean()),
    runState: Type.Optional(Type.String()), // TODO: THe database restricts this to a set of values, but we don't have a way to express that in typebox afaik
    updatedAt: Type.Optional(Type.String()),
    pingedAt: Type.Optional(Type.String()),
    data: Type.Optional(Type.Any()),
    publicVariables: Type.Optional(Type.Any()),
    secrets: Type.Optional(Type.String()),
    image: Type.Optional(Type.String()),
    default: Type.Optional(Type.Boolean()),
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
    content: Type.Optional(Type.String()),
    projectId: Type.String(),
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

/** The interface for a document object that's based on the `documentSchema`. */
export type Document = Static<typeof documentSchema>

/**
 * Full data model schema for a collection.
 *
 * @property {string} id - The collection's ID.
 * @property {string} name - The name of the collection.
 * @property {string} projectId - The ID of the project that the collection belongs to.
 * @property {string} [description] - Description of the collection (optional).
 * @property {string} createdAt - Timestamp of when the collection was created.
 * @property {string} updatedAt - Timestamp of when the collection was last updated.
 * @property {string | null} [deletedAt] - Timestamp of when the collection was deleted, or null if not deleted.
 */

export const collectionSchema = Type.Object(
  {
    id: Type.String(),
    name: Type.String(),
    projectId: Type.String(),
    description: Type.Optional(Type.String()),
    createdAt: Type.String(),
    updatedAt: Type.String(),
    deletedAt: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  },
  { $id: 'Collection', additionalProperties: false }
)

/** The type for a collection object that's based on the `collectionSchema`. */
export type CollectionSchema = Static<typeof collectionSchema>
/** The interface for a collection object that's based on the `collectionSchema`. */
export type CollectionInterface = CollectionSchema

/**
 * Full data model schema for a record.
 *
 * @property {string} id - The record's ID.
 * @property {string} key - The key of the record.
 * @property {string} collectionId - The ID of the collection that the record belongs to.
 * @property {any} [data] - The data for the record (optional).
 * @property {any} [metadata] - The metadata for the record (optional).
 * @property {string} createdAt - Timestamp of when the record was created.
 * @property {string} updatedAt - Timestamp of when the record was last updated.
 * @property {string | null} [deletedAt] - Timestamp of when the record was deleted, or null if not deleted.
 */
export const recordSchema = Type.Object(
  {
    id: Type.String(),
    key: Type.String(),
    collectionId: Type.String(),
    data: Type.Optional(Type.Any()),
    metadata: Type.Optional(Type.Any()),
    createdAt: Type.String(),
    updatedAt: Type.String(),
    deletedAt: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  },
  { $id: 'Record', additionalProperties: false }
)

/** The type for a record object that's based on the `recordSchema`. */
export type RecordSchema = Static<typeof recordSchema>
/** The interface for a record object that's based on the `recordSchema`. */
export type RecordInterface = RecordSchema

/**
 * Full data model schema for a generation.
 *
 * @property {string} id - The generation's ID.
 * @property {string} projectId - The ID of the project that the generation belongs to.
 * @property {string} modelName - The name of the generative model used.
 * @property {string} [description] - Description of the generation (optional).
 * @property {string[]} [outputPaths] - Paths to the generation outputs (optional).
 * @property {'image' | 'audio' | 'video'} type - Type of the generation.
 * @property {string} createdAt - Timestamp of when the generation was created.
 * @property {string | null} [deletedAt] - Timestamp of when the generation was deleted, or null if not deleted.
 */
export const generationSchema = Type.Object(
  {
    id: Type.String(),
    projectId: Type.String(),
    modelName: Type.String(),
    description: Type.Optional(Type.String()),
    outputPaths: Type.Optional(Type.Array(Type.String())),
    type: Type.Union([
      Type.Literal('image'),
      Type.Literal('audio'),
      Type.Literal('video'),
    ]),
    createdAt: Type.String(),
    deletedAt: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  },
  { $id: 'Generation', additionalProperties: false }
)

/**  The type for a generation object that's based on the `generationSchema`. */
export type GenerationSchema = Static<typeof generationSchema>

/** The interface for a generation object that's based on the `generationSchema`. */
export type GenerationInterface = GenerationSchema
