
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  NotFoundError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  detectRuntime,
} = require('./runtime/edge.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.9.1
 * Query Engine version: 23fdc5965b1e05fc54e5f26ed3de66776b93de64
 */
Prisma.prismaVersion = {
  client: "5.9.1",
  engine: "23fdc5965b1e05fc54e5f26ed3de66776b93de64"
}

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.NotFoundError = NotFoundError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */
exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.Agent_credentialsScalarFieldEnum = {
  agentId: 'agentId',
  credentialId: 'credentialId',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.AgentsScalarFieldEnum = {
  id: 'id',
  rootSpell: 'rootSpell',
  publicVariables: 'publicVariables',
  secrets: 'secrets',
  name: 'name',
  enabled: 'enabled',
  updatedAt: 'updatedAt',
  pingedAt: 'pingedAt',
  projectId: 'projectId',
  data: 'data',
  runState: 'runState',
  image: 'image',
  rootSpellId: 'rootSpellId',
  default: 'default',
  createdAt: 'createdAt',
  currentSpellReleaseId: 'currentSpellReleaseId',
  embedModel: 'embedModel',
  version: 'version',
  embeddingProvider: 'embeddingProvider',
  embeddingModel: 'embeddingModel',
  isDraft: 'isDraft',
  draftAgentId: 'draftAgentId',
  description: 'description'
};

exports.Prisma.ChatMessagesScalarFieldEnum = {
  id: 'id',
  agentId: 'agentId',
  sender: 'sender',
  connector: 'connector',
  content: 'content',
  conversationId: 'conversationId',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.CredentialsScalarFieldEnum = {
  id: 'id',
  projectId: 'projectId',
  name: 'name',
  serviceType: 'serviceType',
  credentialType: 'credentialType',
  value: 'value',
  description: 'description',
  metadata: 'metadata',
  pluginName: 'pluginName',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.DocumentsScalarFieldEnum = {
  id: 'id',
  type: 'type',
  projectId: 'projectId',
  date: 'date',
  metadata: 'metadata'
};

exports.Prisma.EmbeddingsScalarFieldEnum = {
  id: 'id',
  documentId: 'documentId',
  content: 'content',
  index: 'index'
};

exports.Prisma.Public_eventsScalarFieldEnum = {
  id: 'id',
  type: 'type',
  observer: 'observer',
  sender: 'sender',
  client: 'client',
  channel: 'channel',
  channelType: 'channelType',
  projectId: 'projectId',
  content: 'content',
  agentId: 'agentId',
  entities: 'entities',
  date: 'date',
  rawData: 'rawData',
  connector: 'connector'
};

exports.Prisma.GraphEventsScalarFieldEnum = {
  id: 'id',
  agentId: 'agentId',
  sender: 'sender',
  connector: 'connector',
  connectorData: 'connectorData',
  content: 'content',
  eventType: 'eventType',
  created_at: 'created_at',
  updated_at: 'updated_at',
  event: 'event',
  observer: 'observer',
  channel: 'channel'
};

exports.Prisma.Public_knex_migrationsScalarFieldEnum = {
  id: 'id',
  name: 'name',
  batch: 'batch',
  migration_time: 'migration_time'
};

exports.Prisma.Public_knex_migrations_lockScalarFieldEnum = {
  index: 'index',
  is_locked: 'is_locked'
};

exports.Prisma.KnowledgeScalarFieldEnum = {
  id: 'id',
  name: 'name',
  sourceUrl: 'sourceUrl',
  dataType: 'dataType',
  data: 'data',
  projectId: 'projectId',
  metadata: 'metadata',
  memoryId: 'memoryId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PluginStateScalarFieldEnum = {
  id: 'id',
  agentId: 'agentId',
  state: 'state',
  plugin: 'plugin',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.RequestScalarFieldEnum = {
  id: 'id',
  projectId: 'projectId',
  requestData: 'requestData',
  responseData: 'responseData',
  duration: 'duration',
  status: 'status',
  statusCode: 'statusCode',
  model: 'model',
  parameters: 'parameters',
  createdAt: 'createdAt',
  provider: 'provider',
  type: 'type',
  hidden: 'hidden',
  processed: 'processed',
  cost: 'cost',
  spell: 'spell',
  nodeId: 'nodeId',
  agentId: 'agentId'
};

exports.Prisma.SpellReleasesScalarFieldEnum = {
  id: 'id',
  description: 'description',
  agentId: 'agentId',
  spellId: 'spellId',
  projectId: 'projectId',
  createdAt: 'createdAt'
};

exports.Prisma.SpellsScalarFieldEnum = {
  id: 'id',
  name: 'name',
  projectId: 'projectId',
  graph: 'graph',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  type: 'type',
  spellReleaseId: 'spellReleaseId'
};

exports.Prisma.TasksScalarFieldEnum = {
  id: 'id',
  status: 'status',
  type: 'type',
  objective: 'objective',
  eventData: 'eventData',
  projectId: 'projectId',
  date: 'date',
  steps: 'steps',
  agentId: 'agentId'
};

exports.Prisma.WebhookScalarFieldEnum = {
  id: 'id',
  agentId: 'agentId',
  url: 'url',
  method: 'method',
  headers: 'headers',
  body: 'body',
  response: 'response',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SeraphEventScalarFieldEnum = {
  id: 'id',
  agentId: 'agentId',
  projectId: 'projectId',
  spellId: 'spellId',
  type: 'type',
  data: 'data',
  createdAt: 'createdAt'
};

exports.Prisma.MemoryScalarFieldEnum = {
  id: 'id',
  role: 'role',
  content: 'content',
  type: 'type',
  event: 'event',
  channel: 'channel',
  agentId: 'agentId',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.agent_credentialsOrderByRelevanceFieldEnum = {
  agentId: 'agentId',
  credentialId: 'credentialId'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.agentsOrderByRelevanceFieldEnum = {
  id: 'id',
  publicVariables: 'publicVariables',
  secrets: 'secrets',
  name: 'name',
  updatedAt: 'updatedAt',
  pingedAt: 'pingedAt',
  projectId: 'projectId',
  runState: 'runState',
  image: 'image',
  rootSpellId: 'rootSpellId',
  currentSpellReleaseId: 'currentSpellReleaseId',
  embedModel: 'embedModel',
  version: 'version',
  embeddingProvider: 'embeddingProvider',
  embeddingModel: 'embeddingModel',
  draftAgentId: 'draftAgentId',
  description: 'description'
};

exports.Prisma.chatMessagesOrderByRelevanceFieldEnum = {
  id: 'id',
  agentId: 'agentId',
  sender: 'sender',
  connector: 'connector',
  content: 'content',
  conversationId: 'conversationId'
};

exports.Prisma.credentialsOrderByRelevanceFieldEnum = {
  id: 'id',
  projectId: 'projectId',
  name: 'name',
  serviceType: 'serviceType',
  credentialType: 'credentialType',
  value: 'value',
  description: 'description',
  pluginName: 'pluginName'
};

exports.Prisma.documentsOrderByRelevanceFieldEnum = {
  id: 'id',
  type: 'type',
  projectId: 'projectId',
  date: 'date'
};

exports.Prisma.embeddingsOrderByRelevanceFieldEnum = {
  documentId: 'documentId',
  content: 'content'
};

exports.Prisma.public_eventsOrderByRelevanceFieldEnum = {
  id: 'id',
  type: 'type',
  observer: 'observer',
  sender: 'sender',
  client: 'client',
  channel: 'channel',
  channelType: 'channelType',
  projectId: 'projectId',
  content: 'content',
  agentId: 'agentId',
  entities: 'entities',
  date: 'date',
  rawData: 'rawData',
  connector: 'connector'
};

exports.Prisma.graphEventsOrderByRelevanceFieldEnum = {
  id: 'id',
  agentId: 'agentId',
  sender: 'sender',
  connector: 'connector',
  content: 'content',
  eventType: 'eventType',
  observer: 'observer',
  channel: 'channel'
};

exports.Prisma.public_knex_migrationsOrderByRelevanceFieldEnum = {
  name: 'name'
};

exports.Prisma.knowledgeOrderByRelevanceFieldEnum = {
  id: 'id',
  name: 'name',
  sourceUrl: 'sourceUrl',
  dataType: 'dataType',
  data: 'data',
  projectId: 'projectId',
  memoryId: 'memoryId'
};

exports.Prisma.pluginStateOrderByRelevanceFieldEnum = {
  id: 'id',
  agentId: 'agentId',
  plugin: 'plugin'
};

exports.Prisma.requestOrderByRelevanceFieldEnum = {
  id: 'id',
  projectId: 'projectId',
  requestData: 'requestData',
  responseData: 'responseData',
  status: 'status',
  model: 'model',
  parameters: 'parameters',
  provider: 'provider',
  type: 'type',
  spell: 'spell',
  nodeId: 'nodeId',
  agentId: 'agentId'
};

exports.Prisma.spellReleasesOrderByRelevanceFieldEnum = {
  id: 'id',
  description: 'description',
  agentId: 'agentId',
  spellId: 'spellId',
  projectId: 'projectId'
};

exports.Prisma.spellsOrderByRelevanceFieldEnum = {
  id: 'id',
  name: 'name',
  projectId: 'projectId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  type: 'type',
  spellReleaseId: 'spellReleaseId'
};

exports.Prisma.tasksOrderByRelevanceFieldEnum = {
  status: 'status',
  type: 'type',
  objective: 'objective',
  projectId: 'projectId',
  date: 'date',
  steps: 'steps',
  agentId: 'agentId'
};

exports.Prisma.WebhookOrderByRelevanceFieldEnum = {
  id: 'id',
  agentId: 'agentId',
  url: 'url'
};

exports.Prisma.SeraphEventOrderByRelevanceFieldEnum = {
  id: 'id',
  agentId: 'agentId',
  projectId: 'projectId',
  spellId: 'spellId',
  type: 'type'
};

exports.Prisma.MemoryOrderByRelevanceFieldEnum = {
  id: 'id',
  role: 'role',
  content: 'content',
  type: 'type',
  channel: 'channel',
  agentId: 'agentId'
};
exports.WebhookMethod = exports.$Enums.WebhookMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  OPTIONS: 'OPTIONS',
  HEAD: 'HEAD',
  CONNECT: 'CONNECT',
  TRACE: 'TRACE'
};

exports.WebhookStatus = exports.$Enums.WebhookStatus = {
  ACTIVE: 'ACTIVE',
  REJECTED: 'REJECTED',
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE'
};

exports.Prisma.ModelName = {
  agent_credentials: 'agent_credentials',
  agents: 'agents',
  chatMessages: 'chatMessages',
  credentials: 'credentials',
  documents: 'documents',
  embeddings: 'embeddings',
  public_events: 'public_events',
  graphEvents: 'graphEvents',
  public_knex_migrations: 'public_knex_migrations',
  public_knex_migrations_lock: 'public_knex_migrations_lock',
  knowledge: 'knowledge',
  pluginState: 'pluginState',
  request: 'request',
  spellReleases: 'spellReleases',
  spells: 'spells',
  tasks: 'tasks',
  Webhook: 'Webhook',
  SeraphEvent: 'SeraphEvent',
  Memory: 'Memory'
};
/**
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "/Users/parzival/workspace/oneirocom/magickML/packages/server/db/src/lib/prisma/client-core",
      "fromEnvVar": null
    },
    "config": {
      "name": "prisma",
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "darwin-arm64",
        "native": true
      }
    ],
    "previewFeatures": [
      "fullTextSearch",
      "multiSchema",
      "postgresqlExtensions"
    ],
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": null
  },
  "relativePath": "..",
  "clientVersion": "5.9.1",
  "engineVersion": "23fdc5965b1e05fc54e5f26ed3de66776b93de64",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "postinstall": false,
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "DATABASE_URL",
        "value": null
      }
    }
  },
  "inlineSchema": "Z2VuZXJhdG9yIGNsaWVudCB7CiAgICBwcm92aWRlciAgICAgICAgPSAicHJpc21hLWNsaWVudC1qcyIKICAgIG91dHB1dCAgICAgICAgICA9ICIuL2NsaWVudC1jb3JlIgogICAgcHJldmlld0ZlYXR1cmVzID0gWyJmdWxsVGV4dFNlYXJjaCIsICJtdWx0aVNjaGVtYSIsICJwb3N0Z3Jlc3FsRXh0ZW5zaW9ucyJdCiAgICBuYW1lICAgICAgICAgICAgPSAicHJpc21hIgp9CgpkYXRhc291cmNlIGRiIHsKICAgIHByb3ZpZGVyICAgICAgICAgID0gInBvc3RncmVzcWwiCiAgICB1cmwgICAgICAgICAgICAgICA9IGVudigiREFUQUJBU0VfVVJMIikKICAgIHNoYWRvd0RhdGFiYXNlVXJsID0gZW52KCJTSEFET1dfREFUQUJBU0VfVVJMIikKICAgIGV4dGVuc2lvbnMgICAgICAgID0gW3V1aWRfb3NzcChtYXA6ICJ1dWlkLW9zc3AiKSwgdmVjdG9yXQogICAgc2NoZW1hcyAgICAgICAgICAgPSBbInB1YmxpYyJdCn0KCm1vZGVsIGFnZW50X2NyZWRlbnRpYWxzIHsKICAgIGFnZW50SWQgICAgICBTdHJpbmcgICAgICBAZGIuVXVpZAogICAgY3JlZGVudGlhbElkIFN0cmluZyAgICAgIEBkYi5VdWlkCiAgICBjcmVhdGVkX2F0ICAgRGF0ZVRpbWUgICAgQGRlZmF1bHQobm93KCkpIEBkYi5UaW1lc3RhbXB0eig2KQogICAgdXBkYXRlZF9hdCAgIERhdGVUaW1lICAgIEBkZWZhdWx0KG5vdygpKSBAZGIuVGltZXN0YW1wdHooNikKICAgIGFnZW50cyAgICAgICBhZ2VudHMgICAgICBAcmVsYXRpb24oZmllbGRzOiBbYWdlbnRJZF0sIHJlZmVyZW5jZXM6IFtpZF0sIG9uRGVsZXRlOiBDYXNjYWRlLCBvblVwZGF0ZTogTm9BY3Rpb24sIG1hcDogImFnZW50X2NyZWRlbnRpYWxzX2FnZW50aWRfZm9yZWlnbiIpCiAgICBjcmVkZW50aWFscyAgY3JlZGVudGlhbHMgQHJlbGF0aW9uKGZpZWxkczogW2NyZWRlbnRpYWxJZF0sIHJlZmVyZW5jZXM6IFtpZF0sIG9uRGVsZXRlOiBDYXNjYWRlLCBvblVwZGF0ZTogTm9BY3Rpb24sIG1hcDogImFnZW50X2NyZWRlbnRpYWxzX2NyZWRlbnRpYWxpZF9mb3JlaWduIikKCiAgICBAQGlkKFthZ2VudElkLCBjcmVkZW50aWFsSWRdKQogICAgQEBzY2hlbWEoInB1YmxpYyIpCn0KCm1vZGVsIGFnZW50cyB7CiAgICBpZCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU3RyaW5nICAgICAgICAgICAgICBAaWQgQHVuaXF1ZSBAZGIuVXVpZAogICAgcm9vdFNwZWxsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpzb24/CiAgICBwdWJsaWNWYXJpYWJsZXMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU3RyaW5nPwogICAgc2VjcmV0cyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFN0cmluZz8KICAgIG5hbWUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTdHJpbmc/CiAgICBlbmFibGVkICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQm9vbGVhbj8KICAgIHVwZGF0ZWRBdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTdHJpbmc/CiAgICBwaW5nZWRBdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU3RyaW5nPwogICAgcHJvamVjdElkICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFN0cmluZz8KICAgIGRhdGEgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBKc29uPwogICAgcnVuU3RhdGUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFN0cmluZyAgICAgICAgICAgICAgQGRlZmF1bHQoInN0b3BwZWQiKQogICAgaW1hZ2UgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFN0cmluZz8KICAgIHJvb3RTcGVsbElkICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTdHJpbmc/ICAgICAgICAgICAgIEBkYi5VdWlkCiAgICBkZWZhdWx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQm9vbGVhbiAgICAgICAgICAgICBAZGVmYXVsdChmYWxzZSkKICAgIGNyZWF0ZWRBdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEYXRlVGltZT8gICAgICAgICAgIEBkZWZhdWx0KG5vdygpKSBAZGIuVGltZXN0YW1wdHooNikKICAgIGN1cnJlbnRTcGVsbFJlbGVhc2VJZCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTdHJpbmc/ICAgICAgICAgICAgIEBkYi5VdWlkCiAgICBlbWJlZE1vZGVsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU3RyaW5nPyAgICAgICAgICAgICBAZGIuVmFyQ2hhcigyNTUpCiAgICB2ZXJzaW9uICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU3RyaW5nICAgICAgICAgICAgICBAZGVmYXVsdCgiMS4wIikgQGRiLlZhckNoYXIoMjU1KQogICAgZW1iZWRkaW5nUHJvdmlkZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFN0cmluZz8gICAgICAgICAgICAgQGRiLlZhckNoYXIoMjU1KQogICAgZW1iZWRkaW5nTW9kZWwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFN0cmluZz8gICAgICAgICAgICAgQGRiLlZhckNoYXIoMjU1KQogICAgaXNEcmFmdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEJvb2xlYW4gICAgICAgICAgICAgQGRlZmF1bHQoZmFsc2UpCiAgICBkcmFmdEFnZW50SWQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU3RyaW5nPyAgICAgICAgICAgICBAZGIuVXVpZAogICAgZGVzY3JpcHRpb24gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFN0cmluZz8gICAgICAgICAgICAgQGRiLlZhckNoYXIoMjU1KQogICAgYWdlbnRfY3JlZGVudGlhbHMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFnZW50X2NyZWRlbnRpYWxzW10KICAgIHNwZWxsUmVsZWFzZXNfYWdlbnRzX2N1cnJlbnRTcGVsbFJlbGVhc2VJZFRvc3BlbGxSZWxlYXNlcyBzcGVsbFJlbGVhc2VzPyAgICAgIEByZWxhdGlvbigiYWdlbnRzX2N1cnJlbnRTcGVsbFJlbGVhc2VJZFRvc3BlbGxSZWxlYXNlcyIsIGZpZWxkczogW2N1cnJlbnRTcGVsbFJlbGVhc2VJZF0sIHJlZmVyZW5jZXM6IFtpZF0sIG9uRGVsZXRlOiBDYXNjYWRlLCBvblVwZGF0ZTogTm9BY3Rpb24sIG1hcDogImFnZW50c19jdXJyZW50c3BlbGxyZWxlYXNlaWRfZm9yZWlnbiIpCiAgICBjaGF0TWVzc2FnZXMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhdE1lc3NhZ2VzW10KICAgIGdyYXBoRXZlbnRzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBncmFwaEV2ZW50c1tdCiAgICBwbHVnaW5TdGF0ZSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGx1Z2luU3RhdGVbXQogICAgc3BlbGxSZWxlYXNlc19zcGVsbFJlbGVhc2VzX2FnZW50SWRUb2FnZW50cyAgICAgICAgICAgICAgIHNwZWxsUmVsZWFzZXNbXSAgICAgQHJlbGF0aW9uKCJzcGVsbFJlbGVhc2VzX2FnZW50SWRUb2FnZW50cyIpCiAgICBXZWJob29rICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2ViaG9va1tdCgogICAgQEBzY2hlbWEoInB1YmxpYyIpCn0KCm1vZGVsIGNoYXRNZXNzYWdlcyB7CiAgICBpZCAgICAgICAgICAgICBTdHJpbmcgICBAaWQgQGRlZmF1bHQoZGJnZW5lcmF0ZWQoInV1aWRfZ2VuZXJhdGVfdjQoKSIpKSBAZGIuVXVpZAogICAgYWdlbnRJZCAgICAgICAgU3RyaW5nICAgQGRiLlV1aWQKICAgIHNlbmRlciAgICAgICAgIFN0cmluZz8gIEBkYi5WYXJDaGFyKDI1NSkKICAgIGNvbm5lY3RvciAgICAgIFN0cmluZyAgIEBkYi5WYXJDaGFyKDI1NSkKICAgIGNvbnRlbnQgICAgICAgIFN0cmluZz8KICAgIGNvbnZlcnNhdGlvbklkIFN0cmluZz8gIEBkYi5WYXJDaGFyKDI1NSkKICAgIGNyZWF0ZWRfYXQgICAgIERhdGVUaW1lIEBkZWZhdWx0KG5vdygpKSBAZGIuVGltZXN0YW1wdHooNikKICAgIHVwZGF0ZWRfYXQgICAgIERhdGVUaW1lIEBkZWZhdWx0KG5vdygpKSBAZGIuVGltZXN0YW1wdHooNikKICAgIGFnZW50cyAgICAgICAgIGFnZW50cyAgIEByZWxhdGlvbihmaWVsZHM6IFthZ2VudElkXSwgcmVmZXJlbmNlczogW2lkXSwgb25EZWxldGU6IENhc2NhZGUsIG9uVXBkYXRlOiBOb0FjdGlvbiwgbWFwOiAiY2hhdG1lc3NhZ2VzX2FnZW50aWRfZm9yZWlnbiIpCgogICAgQEBzY2hlbWEoInB1YmxpYyIpCn0KCm1vZGVsIGNyZWRlbnRpYWxzIHsKICAgIGlkICAgICAgICAgICAgICAgIFN0cmluZyAgICAgICAgICAgICAgQGlkIEB1bmlxdWUgQGRlZmF1bHQoZGJnZW5lcmF0ZWQoInV1aWRfZ2VuZXJhdGVfdjQoKSIpKSBAZGIuVXVpZAogICAgcHJvamVjdElkICAgICAgICAgU3RyaW5nICAgICAgICAgICAgICBAZGIuVmFyQ2hhcigyNTUpCiAgICBuYW1lICAgICAgICAgICAgICBTdHJpbmcgICAgICAgICAgICAgIEBkYi5WYXJDaGFyKDI1NSkKICAgIHNlcnZpY2VUeXBlICAgICAgIFN0cmluZyAgICAgICAgICAgICAgQGRiLlZhckNoYXIoMjU1KQogICAgY3JlZGVudGlhbFR5cGUgICAgU3RyaW5nCiAgICB2YWx1ZSAgICAgICAgICAgICBTdHJpbmcKICAgIGRlc2NyaXB0aW9uICAgICAgIFN0cmluZz8KICAgIG1ldGFkYXRhICAgICAgICAgIEpzb24/CiAgICBwbHVnaW5OYW1lICAgICAgICBTdHJpbmc/CiAgICBjcmVhdGVkX2F0ICAgICAgICBEYXRlVGltZSAgICAgICAgICAgIEBkZWZhdWx0KG5vdygpKSBAZGIuVGltZXN0YW1wdHooNikKICAgIHVwZGF0ZWRfYXQgICAgICAgIERhdGVUaW1lICAgICAgICAgICAgQGRlZmF1bHQobm93KCkpIEBkYi5UaW1lc3RhbXB0eig2KQogICAgYWdlbnRfY3JlZGVudGlhbHMgYWdlbnRfY3JlZGVudGlhbHNbXQoKICAgIEBAc2NoZW1hKCJwdWJsaWMiKQp9Cgptb2RlbCBkb2N1bWVudHMgewogICAgaWQgICAgICAgIFN0cmluZyAgQGlkIEBkYi5VdWlkCiAgICB0eXBlICAgICAgU3RyaW5nPwogICAgcHJvamVjdElkIFN0cmluZz8KICAgIGRhdGUgICAgICBTdHJpbmc/CiAgICBtZXRhZGF0YSAgSnNvbj8gICBAZGVmYXVsdCgie30iKQoKICAgIEBAc2NoZW1hKCJwdWJsaWMiKQp9Cgptb2RlbCBlbWJlZGRpbmdzIHsKICAgIGlkICAgICAgICAgSW50ICAgICAgICAgICAgICAgICAgICBAaWQgQGRlZmF1bHQoYXV0b2luY3JlbWVudCgpKQogICAgZG9jdW1lbnRJZCBTdHJpbmc/ICAgICAgICAgICAgICAgIEBkYi5VdWlkCiAgICBjb250ZW50ICAgIFN0cmluZz8KICAgIGVtYmVkZGluZyAgVW5zdXBwb3J0ZWQoInZlY3RvciIpPwogICAgaW5kZXggICAgICBJbnQ/CgogICAgQEBzY2hlbWEoInB1YmxpYyIpCn0KCm1vZGVsIHB1YmxpY19ldmVudHMgewogICAgaWQgICAgICAgICAgU3RyaW5nICAgICAgICAgICAgICAgICBAaWQgQGRiLlV1aWQKICAgIHR5cGUgICAgICAgIFN0cmluZz8KICAgIG9ic2VydmVyICAgIFN0cmluZz8KICAgIHNlbmRlciAgICAgIFN0cmluZz8KICAgIGNsaWVudCAgICAgIFN0cmluZz8KICAgIGNoYW5uZWwgICAgIFN0cmluZz8KICAgIGNoYW5uZWxUeXBlIFN0cmluZz8KICAgIHByb2plY3RJZCAgIFN0cmluZz8KICAgIGNvbnRlbnQgICAgIFN0cmluZz8KICAgIGFnZW50SWQgICAgIFN0cmluZz8KICAgIGVudGl0aWVzICAgIFN0cmluZ1tdCiAgICBlbWJlZGRpbmcgICBVbnN1cHBvcnRlZCgidmVjdG9yIik/CiAgICBkYXRlICAgICAgICBTdHJpbmc/CiAgICByYXdEYXRhICAgICBTdHJpbmc/CiAgICBjb25uZWN0b3IgICBTdHJpbmc/CgogICAgQEBtYXAoImV2ZW50cyIpCiAgICBAQHNjaGVtYSgicHVibGljIikKfQoKbW9kZWwgZ3JhcGhFdmVudHMgewogICAgaWQgICAgICAgICAgICBTdHJpbmcgICBAaWQgQGRlZmF1bHQoZGJnZW5lcmF0ZWQoInV1aWRfZ2VuZXJhdGVfdjQoKSIpKSBAZGIuVXVpZAogICAgYWdlbnRJZCAgICAgICBTdHJpbmcgICBAZGIuVXVpZAogICAgc2VuZGVyICAgICAgICBTdHJpbmcgICBAZGIuVmFyQ2hhcigyNTUpCiAgICBjb25uZWN0b3IgICAgIFN0cmluZyAgIEBkYi5WYXJDaGFyKDI1NSkKICAgIGNvbm5lY3RvckRhdGEgSnNvbj8KICAgIGNvbnRlbnQgICAgICAgU3RyaW5nCiAgICBldmVudFR5cGUgICAgIFN0cmluZyAgIEBkYi5WYXJDaGFyKDI1NSkKICAgIGNyZWF0ZWRfYXQgICAgRGF0ZVRpbWUgQGRlZmF1bHQobm93KCkpIEBkYi5UaW1lc3RhbXB0eig2KQogICAgdXBkYXRlZF9hdCAgICBEYXRlVGltZSBAZGVmYXVsdChub3coKSkgQGRiLlRpbWVzdGFtcHR6KDYpCiAgICBldmVudCAgICAgICAgIEpzb24/ICAgIEBkZWZhdWx0KCJ7fSIpCiAgICBvYnNlcnZlciAgICAgIFN0cmluZz8gIEBkYi5WYXJDaGFyKDI1NSkKICAgIGNoYW5uZWwgICAgICAgU3RyaW5nPyAgQGRiLlZhckNoYXIoMjU1KQogICAgYWdlbnRzICAgICAgICBhZ2VudHMgICBAcmVsYXRpb24oZmllbGRzOiBbYWdlbnRJZF0sIHJlZmVyZW5jZXM6IFtpZF0sIG9uRGVsZXRlOiBDYXNjYWRlLCBvblVwZGF0ZTogTm9BY3Rpb24sIG1hcDogImdyYXBoZXZlbnRzX2FnZW50aWRfZm9yZWlnbiIpCgogICAgQEBzY2hlbWEoInB1YmxpYyIpCn0KCm1vZGVsIHB1YmxpY19rbmV4X21pZ3JhdGlvbnMgewogICAgaWQgICAgICAgICAgICAgSW50ICAgICAgIEBpZCBAZGVmYXVsdChhdXRvaW5jcmVtZW50KCkpCiAgICBuYW1lICAgICAgICAgICBTdHJpbmc/ICAgQGRiLlZhckNoYXIoMjU1KQogICAgYmF0Y2ggICAgICAgICAgSW50PwogICAgbWlncmF0aW9uX3RpbWUgRGF0ZVRpbWU/IEBkYi5UaW1lc3RhbXB0eig2KQoKICAgIEBAbWFwKCJrbmV4X21pZ3JhdGlvbnMiKQogICAgQEBzY2hlbWEoInB1YmxpYyIpCn0KCm1vZGVsIHB1YmxpY19rbmV4X21pZ3JhdGlvbnNfbG9jayB7CiAgICBpbmRleCAgICAgSW50ICBAaWQgQGRlZmF1bHQoYXV0b2luY3JlbWVudCgpKQogICAgaXNfbG9ja2VkIEludD8KCiAgICBAQG1hcCgia25leF9taWdyYXRpb25zX2xvY2siKQogICAgQEBzY2hlbWEoInB1YmxpYyIpCn0KCm1vZGVsIGtub3dsZWRnZSB7CiAgICBpZCAgICAgICAgU3RyaW5nICAgIEBpZCBAZGVmYXVsdChkYmdlbmVyYXRlZCgidXVpZF9nZW5lcmF0ZV92NCgpIikpIEBkYi5VdWlkCiAgICBuYW1lICAgICAgU3RyaW5nICAgIEBkYi5WYXJDaGFyKDI1NSkKICAgIHNvdXJjZVVybCBTdHJpbmc/ICAgQGRiLlZhckNoYXIoMjU1KQogICAgZGF0YVR5cGUgIFN0cmluZz8gICBAZGIuVmFyQ2hhcigyNTUpCiAgICBkYXRhICAgICAgU3RyaW5nPyAgIEBkYi5WYXJDaGFyKDI1NSkKICAgIHByb2plY3RJZCBTdHJpbmcgICAgQGRiLlZhckNoYXIoMjU1KQogICAgbWV0YWRhdGEgIEpzb24/ICAgICBAZGIuSnNvbgogICAgbWVtb3J5SWQgIFN0cmluZz8gICBAZGIuVmFyQ2hhcigyNTUpCiAgICBjcmVhdGVkQXQgRGF0ZVRpbWU/IEBkZWZhdWx0KG5vdygpKSBAZGIuVGltZXN0YW1wdHooNikKICAgIHVwZGF0ZWRBdCBEYXRlVGltZT8gQGRlZmF1bHQobm93KCkpIEBkYi5UaW1lc3RhbXB0eig2KQoKICAgIEBAc2NoZW1hKCJwdWJsaWMiKQp9Cgptb2RlbCBwbHVnaW5TdGF0ZSB7CiAgICBpZCAgICAgICAgU3RyaW5nICAgIEBpZCBAZGVmYXVsdChkYmdlbmVyYXRlZCgidXVpZF9nZW5lcmF0ZV92NCgpIikpIEBkYi5VdWlkCiAgICBhZ2VudElkICAgU3RyaW5nPyAgIEBkYi5VdWlkCiAgICBzdGF0ZSAgICAgSnNvbj8gICAgIEBkYi5Kc29uCiAgICBwbHVnaW4gICAgU3RyaW5nPyAgIEBkYi5WYXJDaGFyKDI1NSkKICAgIGNyZWF0ZWRBdCBEYXRlVGltZT8gQGRlZmF1bHQobm93KCkpIEBkYi5UaW1lc3RhbXB0eig2KQogICAgdXBkYXRlZEF0IERhdGVUaW1lPyBAZGVmYXVsdChub3coKSkgQGRiLlRpbWVzdGFtcHR6KDYpCiAgICBhZ2VudHMgICAgYWdlbnRzPyAgIEByZWxhdGlvbihmaWVsZHM6IFthZ2VudElkXSwgcmVmZXJlbmNlczogW2lkXSwgb25EZWxldGU6IENhc2NhZGUsIG9uVXBkYXRlOiBOb0FjdGlvbiwgbWFwOiAicGx1Z2luc3RhdGVfYWdlbnRpZF9mb3JlaWduIikKCiAgICBAQHVuaXF1ZShbYWdlbnRJZCwgcGx1Z2luXSwgbWFwOiAicGx1Z2luc3RhdGVfYWdlbnRpZF9wbHVnaW5fdW5pcXVlIikKICAgIEBAc2NoZW1hKCJwdWJsaWMiKQp9Cgptb2RlbCByZXF1ZXN0IHsKICAgIGlkICAgICAgICAgICBTdHJpbmcgICAgQGlkIEBkYi5VdWlkCiAgICBwcm9qZWN0SWQgICAgU3RyaW5nCiAgICByZXF1ZXN0RGF0YSAgU3RyaW5nPwogICAgcmVzcG9uc2VEYXRhIFN0cmluZz8KICAgIGR1cmF0aW9uICAgICBJbnQKICAgIHN0YXR1cyAgICAgICBTdHJpbmc/CiAgICBzdGF0dXNDb2RlICAgSW50PwogICAgbW9kZWwgICAgICAgIFN0cmluZz8KICAgIHBhcmFtZXRlcnMgICBTdHJpbmc/CiAgICBjcmVhdGVkQXQgICAgRGF0ZVRpbWU/IEBkZWZhdWx0KG5vdygpKSBAZGIuVGltZXN0YW1wdHooNikKICAgIHByb3ZpZGVyICAgICBTdHJpbmcKICAgIHR5cGUgICAgICAgICBTdHJpbmcKICAgIGhpZGRlbiAgICAgICBCb29sZWFuICAgQGRlZmF1bHQoZmFsc2UpCiAgICBwcm9jZXNzZWQgICAgQm9vbGVhbiAgIEBkZWZhdWx0KGZhbHNlKQogICAgY29zdCAgICAgICAgIEZsb2F0PwogICAgc3BlbGwgICAgICAgIFN0cmluZz8KICAgIG5vZGVJZCAgICAgICBTdHJpbmc/ICAgQGRiLlZhckNoYXIoMjU1KQogICAgYWdlbnRJZCAgICAgIFN0cmluZyAgICBAZGVmYXVsdCgiIikgQGRiLlZhckNoYXIoMjU1KQoKICAgIEBAc2NoZW1hKCJwdWJsaWMiKQp9Cgptb2RlbCBzcGVsbFJlbGVhc2VzIHsKICAgIGlkICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFN0cmluZyAgICBAaWQgQGRiLlV1aWQKICAgIGRlc2NyaXB0aW9uICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFN0cmluZz8gICBAZGIuVmFyQ2hhcigyNTUpCiAgICBhZ2VudElkICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTdHJpbmcgICAgQGRiLlV1aWQKICAgIHNwZWxsSWQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFN0cmluZz8gICBAZGIuVXVpZAogICAgcHJvamVjdElkICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU3RyaW5nPwogICAgY3JlYXRlZEF0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRGF0ZVRpbWU/IEBkZWZhdWx0KG5vdygpKSBAZGIuVGltZXN0YW1wdHooNikKICAgIGFnZW50c19hZ2VudHNfY3VycmVudFNwZWxsUmVsZWFzZUlkVG9zcGVsbFJlbGVhc2VzIGFnZW50c1tdICBAcmVsYXRpb24oImFnZW50c19jdXJyZW50U3BlbGxSZWxlYXNlSWRUb3NwZWxsUmVsZWFzZXMiKQogICAgYWdlbnRzX3NwZWxsUmVsZWFzZXNfYWdlbnRJZFRvYWdlbnRzICAgICAgICAgICAgICAgYWdlbnRzICAgIEByZWxhdGlvbigic3BlbGxSZWxlYXNlc19hZ2VudElkVG9hZ2VudHMiLCBmaWVsZHM6IFthZ2VudElkXSwgcmVmZXJlbmNlczogW2lkXSwgb25EZWxldGU6IENhc2NhZGUsIG9uVXBkYXRlOiBOb0FjdGlvbiwgbWFwOiAic3BlbGxyZWxlYXNlc19hZ2VudGlkX2ZvcmVpZ24iKQogICAgc3BlbGxzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3BlbGxzW10KCiAgICBAQHNjaGVtYSgicHVibGljIikKfQoKbW9kZWwgc3BlbGxzIHsKICAgIGlkICAgICAgICAgICAgIFN0cmluZyAgICAgICAgIEBpZCBAZGIuVXVpZAogICAgbmFtZSAgICAgICAgICAgU3RyaW5nPwogICAgcHJvamVjdElkICAgICAgU3RyaW5nPwogICAgZ3JhcGggICAgICAgICAgSnNvbj8KICAgIGNyZWF0ZWRBdCAgICAgIFN0cmluZz8KICAgIHVwZGF0ZWRBdCAgICAgIFN0cmluZz8KICAgIHR5cGUgICAgICAgICAgIFN0cmluZz8gICAgICAgIEBkYi5WYXJDaGFyKDI1NSkKICAgIHNwZWxsUmVsZWFzZUlkIFN0cmluZz8gICAgICAgIEBkYi5VdWlkCiAgICBzcGVsbFJlbGVhc2VzICBzcGVsbFJlbGVhc2VzPyBAcmVsYXRpb24oZmllbGRzOiBbc3BlbGxSZWxlYXNlSWRdLCByZWZlcmVuY2VzOiBbaWRdLCBvbkRlbGV0ZTogQ2FzY2FkZSwgb25VcGRhdGU6IE5vQWN0aW9uLCBtYXA6ICJzcGVsbHNfc3BlbGxyZWxlYXNlaWRfZm9yZWlnbiIpCgogICAgQEBzY2hlbWEoInB1YmxpYyIpCn0KCm1vZGVsIHRhc2tzIHsKICAgIGlkICAgICAgICBJbnQgICAgIEBpZCBAZGVmYXVsdChhdXRvaW5jcmVtZW50KCkpCiAgICBzdGF0dXMgICAgU3RyaW5nCiAgICB0eXBlICAgICAgU3RyaW5nCiAgICBvYmplY3RpdmUgU3RyaW5nCiAgICBldmVudERhdGEgSnNvbiAgICBAZGIuSnNvbgogICAgcHJvamVjdElkIFN0cmluZwogICAgZGF0ZSAgICAgIFN0cmluZz8KICAgIHN0ZXBzICAgICBTdHJpbmcKICAgIGFnZW50SWQgICBTdHJpbmc/CgogICAgQEBzY2hlbWEoInB1YmxpYyIpCn0KCm1vZGVsIFdlYmhvb2sgewogICAgaWQgICAgICAgIFN0cmluZyAgICAgICAgQGlkIEBkZWZhdWx0KGRiZ2VuZXJhdGVkKCJ1dWlkX2dlbmVyYXRlX3Y0KCkiKSkgQGRiLlV1aWQKICAgIGFnZW50SWQgICBTdHJpbmcgICAgICAgIEBkYi5VdWlkCiAgICB1cmwgICAgICAgU3RyaW5nCiAgICBtZXRob2QgICAgV2ViaG9va01ldGhvZAogICAgaGVhZGVycyAgIEpzb24/CiAgICBib2R5ICAgICAgSnNvbj8KICAgIHJlc3BvbnNlICBKc29uPwogICAgc3RhdHVzICAgIFdlYmhvb2tTdGF0dXMgQGRlZmF1bHQoQUNUSVZFKQogICAgY3JlYXRlZEF0IERhdGVUaW1lICAgICAgQGRlZmF1bHQobm93KCkpCiAgICB1cGRhdGVkQXQgRGF0ZVRpbWUgICAgICBAdXBkYXRlZEF0CiAgICBhZ2VudCAgICAgYWdlbnRzICAgICAgICBAcmVsYXRpb24oZmllbGRzOiBbYWdlbnRJZF0sIHJlZmVyZW5jZXM6IFtpZF0sIG9uRGVsZXRlOiBDYXNjYWRlLCBvblVwZGF0ZTogTm9BY3Rpb24sIG1hcDogIndlYmhvb2tfYWdlbnRpZF9mb3JlaWduIikKCiAgICBAQHNjaGVtYSgicHVibGljIikKfQoKZW51bSBXZWJob29rTWV0aG9kIHsKICAgIEdFVAogICAgUE9TVAogICAgUFVUCiAgICBQQVRDSAogICAgREVMRVRFCiAgICBPUFRJT05TCiAgICBIRUFECiAgICBDT05ORUNUCiAgICBUUkFDRQoKICAgIEBAc2NoZW1hKCJwdWJsaWMiKQp9CgplbnVtIFdlYmhvb2tTdGF0dXMgewogICAgQUNUSVZFCiAgICBSRUpFQ1RFRAogICAgU1VDQ0VTUwogICAgRkFJTFVSRQoKICAgIEBAc2NoZW1hKCJwdWJsaWMiKQp9Cgptb2RlbCBTZXJhcGhFdmVudCB7CiAgICBpZCAgICAgICAgU3RyaW5nICAgIEBpZCBAZGIuVXVpZAogICAgYWdlbnRJZCAgIFN0cmluZyAgICBAZGIuVXVpZAogICAgcHJvamVjdElkIFN0cmluZyAgICBAZGIuVXVpZAogICAgc3BlbGxJZCAgIFN0cmluZz8gICBAZGIuVXVpZAogICAgdHlwZSAgICAgIFN0cmluZyAgICBAZGIuVmFyQ2hhcigyNTUpCiAgICBkYXRhICAgICAgSnNvbgogICAgY3JlYXRlZEF0IERhdGVUaW1lPyBAZGVmYXVsdChub3coKSkgQGRiLlRpbWVzdGFtcHR6KDYpCgogICAgQEBzY2hlbWEoInB1YmxpYyIpCn0KCm1vZGVsIE1lbW9yeSB7CiAgICBpZCAgICAgICAgU3RyaW5nICAgICAgICAgICAgICAgICBAaWQgQGRlZmF1bHQoY3VpZCgpKQogICAgcm9sZSAgICAgIFN0cmluZwogICAgY29udGVudCAgIFN0cmluZwogICAgdHlwZSAgICAgIFN0cmluZz8KICAgIGV2ZW50ICAgICBKc29uCiAgICBjaGFubmVsICAgU3RyaW5nCiAgICBhZ2VudElkICAgU3RyaW5nCiAgICBjcmVhdGVkQXQgRGF0ZVRpbWUgICAgICAgICAgICAgICBAZGVmYXVsdChub3coKSkKICAgIHZlY3RvciAgICBVbnN1cHBvcnRlZCgidmVjdG9yIik/CgogICAgQEBzY2hlbWEoInB1YmxpYyIpCn0K",
  "inlineSchemaHash": "6ff8b3651c935905786f4adc3d2d1d8717ee8a7bf756f17510f9a07b93f9f6cb",
  "noEngine": false
}
config.dirname = '/'

config.runtimeDataModel = JSON.parse("{\"models\":{\"agent_credentials\":{\"dbName\":null,\"fields\":[{\"name\":\"agentId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"credentialId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"agents\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"agents\",\"relationName\":\"agent_credentialsToagents\",\"relationFromFields\":[\"agentId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"credentials\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"credentials\",\"relationName\":\"agent_credentialsTocredentials\",\"relationFromFields\":[\"credentialId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":{\"name\":null,\"fields\":[\"agentId\",\"credentialId\"]},\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"agents\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"rootSpell\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"publicVariables\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"secrets\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"enabled\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Boolean\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pingedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"projectId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"data\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"runState\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"stopped\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"image\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"rootSpellId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"default\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"currentSpellReleaseId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"embedModel\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"version\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"1.0\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"embeddingProvider\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"embeddingModel\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isDraft\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"draftAgentId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"agent_credentials\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"agent_credentials\",\"relationName\":\"agent_credentialsToagents\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"spellReleases_agents_currentSpellReleaseIdTospellReleases\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"spellReleases\",\"relationName\":\"agents_currentSpellReleaseIdTospellReleases\",\"relationFromFields\":[\"currentSpellReleaseId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"chatMessages\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"chatMessages\",\"relationName\":\"agentsTochatMessages\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"graphEvents\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"graphEvents\",\"relationName\":\"agentsTographEvents\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pluginState\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"pluginState\",\"relationName\":\"agentsTopluginState\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"spellReleases_spellReleases_agentIdToagents\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"spellReleases\",\"relationName\":\"spellReleases_agentIdToagents\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"Webhook\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Webhook\",\"relationName\":\"WebhookToagents\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"chatMessages\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"agentId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sender\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"connector\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"content\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"conversationId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"agents\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"agents\",\"relationName\":\"agentsTochatMessages\",\"relationFromFields\":[\"agentId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"credentials\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"projectId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"serviceType\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"credentialType\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"value\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metadata\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pluginName\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"agent_credentials\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"agent_credentials\",\"relationName\":\"agent_credentialsTocredentials\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"documents\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"projectId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"date\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metadata\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Json\",\"default\":\"{}\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"embeddings\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"documentId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"content\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"index\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"public_events\":{\"dbName\":\"events\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"observer\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sender\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"client\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"channel\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"channelType\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"projectId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"content\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"agentId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"entities\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"date\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"rawData\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"connector\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"graphEvents\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"agentId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sender\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"connector\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"connectorData\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"content\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"eventType\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"event\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Json\",\"default\":\"{}\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"observer\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"channel\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"agents\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"agents\",\"relationName\":\"agentsTographEvents\",\"relationFromFields\":[\"agentId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"public_knex_migrations\":{\"dbName\":\"knex_migrations\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"batch\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"migration_time\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"public_knex_migrations_lock\":{\"dbName\":\"knex_migrations_lock\",\"fields\":[{\"name\":\"index\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"is_locked\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"knowledge\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sourceUrl\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dataType\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"data\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"projectId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metadata\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"memoryId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"pluginState\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"agentId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"state\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"plugin\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"agents\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"agents\",\"relationName\":\"agentsTopluginState\",\"relationFromFields\":[\"agentId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"agentId\",\"plugin\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"agentId\",\"plugin\"]}],\"isGenerated\":false},\"request\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"projectId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"requestData\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"responseData\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"duration\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"statusCode\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"model\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"parameters\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"provider\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"hidden\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"processed\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cost\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"spell\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"nodeId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"agentId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"spellReleases\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"agentId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"spellId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"projectId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"agents_agents_currentSpellReleaseIdTospellReleases\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"agents\",\"relationName\":\"agents_currentSpellReleaseIdTospellReleases\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"agents_spellReleases_agentIdToagents\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"agents\",\"relationName\":\"spellReleases_agentIdToagents\",\"relationFromFields\":[\"agentId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"spells\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"spells\",\"relationName\":\"spellReleasesTospells\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"spells\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"projectId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"graph\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"spellReleaseId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"spellReleases\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"spellReleases\",\"relationName\":\"spellReleasesTospells\",\"relationFromFields\":[\"spellReleaseId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"tasks\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"objective\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"eventData\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"projectId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"date\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"steps\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"agentId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Webhook\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"agentId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"url\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"method\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"WebhookMethod\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"headers\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"body\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"response\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"WebhookStatus\",\"default\":\"ACTIVE\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"agent\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"agents\",\"relationName\":\"WebhookToagents\",\"relationFromFields\":[\"agentId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"SeraphEvent\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"agentId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"projectId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"spellId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"data\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Memory\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"role\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"content\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"event\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"channel\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"agentId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false}},\"enums\":{\"WebhookMethod\":{\"values\":[{\"name\":\"GET\",\"dbName\":null},{\"name\":\"POST\",\"dbName\":null},{\"name\":\"PUT\",\"dbName\":null},{\"name\":\"PATCH\",\"dbName\":null},{\"name\":\"DELETE\",\"dbName\":null},{\"name\":\"OPTIONS\",\"dbName\":null},{\"name\":\"HEAD\",\"dbName\":null},{\"name\":\"CONNECT\",\"dbName\":null},{\"name\":\"TRACE\",\"dbName\":null}],\"dbName\":null},\"WebhookStatus\":{\"values\":[{\"name\":\"ACTIVE\",\"dbName\":null},{\"name\":\"REJECTED\",\"dbName\":null},{\"name\":\"SUCCESS\",\"dbName\":null},{\"name\":\"FAILURE\",\"dbName\":null}],\"dbName\":null}},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.getQueryEngineWasmModule = undefined

config.injectableEdgeEnv = () => ({
  parsed: {
    DATABASE_URL: typeof globalThis !== 'undefined' && globalThis['DATABASE_URL'] || typeof process !== 'undefined' && process.env && process.env.DATABASE_URL || undefined
  }
})

if (typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined) {
  Debug.enable(typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined)
}

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

