
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
  type: 'type',
  data: 'data',
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
  type: 'type'
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
  SeraphEvent: 'SeraphEvent'
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
      "value": "/Users/jakobgrant/Workspaces/Oneirocom/Magick/packages/server/db/src/lib/prisma/client-core",
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
  "inlineSchema": "Z2VuZXJhdG9yIGNsaWVudCB7CiAgcHJvdmlkZXIgICAgICAgID0gInByaXNtYS1jbGllbnQtanMiCiAgb3V0cHV0ICAgICAgICAgID0gIi4vY2xpZW50LWNvcmUiCiAgcHJldmlld0ZlYXR1cmVzID0gWyJmdWxsVGV4dFNlYXJjaCIsICJtdWx0aVNjaGVtYSIsICJwb3N0Z3Jlc3FsRXh0ZW5zaW9ucyJdCiAgbmFtZSAgICAgICAgICAgID0gInByaXNtYSIKfQoKZGF0YXNvdXJjZSBkYiB7CiAgcHJvdmlkZXIgICAgICAgICAgPSAicG9zdGdyZXNxbCIKICB1cmwgICAgICAgICAgICAgICA9IGVudigiREFUQUJBU0VfVVJMIikKICBzaGFkb3dEYXRhYmFzZVVybCA9IGVudigiU0hBRE9XX0RBVEFCQVNFX1VSTCIpCiAgZXh0ZW5zaW9ucyAgICAgICAgPSBbdXVpZF9vc3NwKG1hcDogInV1aWQtb3NzcCIpLCB2ZWN0b3JdCiAgc2NoZW1hcyAgICAgICAgICAgPSBbInB1YmxpYyJdCn0KCm1vZGVsIGFnZW50X2NyZWRlbnRpYWxzIHsKICBhZ2VudElkICAgICAgU3RyaW5nICAgICAgQGRiLlV1aWQKICBjcmVkZW50aWFsSWQgU3RyaW5nICAgICAgQGRiLlV1aWQKICBjcmVhdGVkX2F0ICAgRGF0ZVRpbWUgICAgQGRlZmF1bHQobm93KCkpIEBkYi5UaW1lc3RhbXB0eig2KQogIHVwZGF0ZWRfYXQgICBEYXRlVGltZSAgICBAZGVmYXVsdChub3coKSkgQGRiLlRpbWVzdGFtcHR6KDYpCiAgYWdlbnRzICAgICAgIGFnZW50cyAgICAgIEByZWxhdGlvbihmaWVsZHM6IFthZ2VudElkXSwgcmVmZXJlbmNlczogW2lkXSwgb25EZWxldGU6IENhc2NhZGUsIG9uVXBkYXRlOiBOb0FjdGlvbiwgbWFwOiAiYWdlbnRfY3JlZGVudGlhbHNfYWdlbnRpZF9mb3JlaWduIikKICBjcmVkZW50aWFscyAgY3JlZGVudGlhbHMgQHJlbGF0aW9uKGZpZWxkczogW2NyZWRlbnRpYWxJZF0sIHJlZmVyZW5jZXM6IFtpZF0sIG9uRGVsZXRlOiBDYXNjYWRlLCBvblVwZGF0ZTogTm9BY3Rpb24sIG1hcDogImFnZW50X2NyZWRlbnRpYWxzX2NyZWRlbnRpYWxpZF9mb3JlaWduIikKCiAgQEBpZChbYWdlbnRJZCwgY3JlZGVudGlhbElkXSkKICBAQHNjaGVtYSgicHVibGljIikKfQoKbW9kZWwgYWdlbnRzIHsKICBpZCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU3RyaW5nICAgICAgICAgICAgICBAaWQgQHVuaXF1ZSBAZGIuVXVpZAogIHJvb3RTcGVsbCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBKc29uPwogIHB1YmxpY1ZhcmlhYmxlcyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTdHJpbmc/CiAgc2VjcmV0cyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFN0cmluZz8KICBuYW1lICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU3RyaW5nPwogIGVuYWJsZWQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBCb29sZWFuPwogIHVwZGF0ZWRBdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTdHJpbmc/CiAgcGluZ2VkQXQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFN0cmluZz8KICBwcm9qZWN0SWQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU3RyaW5nPwogIGRhdGEgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBKc29uPwogIHJ1blN0YXRlICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTdHJpbmcgICAgICAgICAgICAgIEBkZWZhdWx0KCJzdG9wcGVkIikKICBpbWFnZSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU3RyaW5nPwogIHJvb3RTcGVsbElkICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTdHJpbmc/ICAgICAgICAgICAgIEBkYi5VdWlkCiAgZGVmYXVsdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEJvb2xlYW4gICAgICAgICAgICAgQGRlZmF1bHQoZmFsc2UpCiAgY3JlYXRlZEF0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIERhdGVUaW1lPyAgICAgICAgICAgQGRlZmF1bHQobm93KCkpIEBkYi5UaW1lc3RhbXB0eig2KQogIGN1cnJlbnRTcGVsbFJlbGVhc2VJZCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTdHJpbmc/ICAgICAgICAgICAgIEBkYi5VdWlkCiAgZW1iZWRNb2RlbCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFN0cmluZz8gICAgICAgICAgICAgQGRiLlZhckNoYXIoMjU1KQogIHZlcnNpb24gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTdHJpbmcgICAgICAgICAgICAgIEBkZWZhdWx0KCIxLjAiKSBAZGIuVmFyQ2hhcigyNTUpCiAgZW1iZWRkaW5nUHJvdmlkZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFN0cmluZz8gICAgICAgICAgICAgQGRiLlZhckNoYXIoMjU1KQogIGVtYmVkZGluZ01vZGVsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTdHJpbmc/ICAgICAgICAgICAgIEBkYi5WYXJDaGFyKDI1NSkKICBpc0RyYWZ0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQm9vbGVhbiAgICAgICAgICAgICBAZGVmYXVsdChmYWxzZSkKICBkcmFmdEFnZW50SWQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU3RyaW5nPyAgICAgICAgICAgICBAZGIuVXVpZAogIGRlc2NyaXB0aW9uICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTdHJpbmc/ICAgICAgICAgICAgIEBkYi5WYXJDaGFyKDI1NSkKICBhZ2VudF9jcmVkZW50aWFscyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWdlbnRfY3JlZGVudGlhbHNbXQogIHNwZWxsUmVsZWFzZXNfYWdlbnRzX2N1cnJlbnRTcGVsbFJlbGVhc2VJZFRvc3BlbGxSZWxlYXNlcyBzcGVsbFJlbGVhc2VzPyAgICAgIEByZWxhdGlvbigiYWdlbnRzX2N1cnJlbnRTcGVsbFJlbGVhc2VJZFRvc3BlbGxSZWxlYXNlcyIsIGZpZWxkczogW2N1cnJlbnRTcGVsbFJlbGVhc2VJZF0sIHJlZmVyZW5jZXM6IFtpZF0sIG9uRGVsZXRlOiBDYXNjYWRlLCBvblVwZGF0ZTogTm9BY3Rpb24sIG1hcDogImFnZW50c19jdXJyZW50c3BlbGxyZWxlYXNlaWRfZm9yZWlnbiIpCiAgY2hhdE1lc3NhZ2VzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXRNZXNzYWdlc1tdCiAgZ3JhcGhFdmVudHMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyYXBoRXZlbnRzW10KICBwbHVnaW5TdGF0ZSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGx1Z2luU3RhdGVbXQogIHNwZWxsUmVsZWFzZXNfc3BlbGxSZWxlYXNlc19hZ2VudElkVG9hZ2VudHMgICAgICAgICAgICAgICBzcGVsbFJlbGVhc2VzW10gICAgIEByZWxhdGlvbigic3BlbGxSZWxlYXNlc19hZ2VudElkVG9hZ2VudHMiKQogIFdlYmhvb2sgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXZWJob29rW10KCiAgQEBzY2hlbWEoInB1YmxpYyIpCn0KCm1vZGVsIGNoYXRNZXNzYWdlcyB7CiAgaWQgICAgICAgICAgICAgU3RyaW5nICAgQGlkIEBkZWZhdWx0KGRiZ2VuZXJhdGVkKCJ1dWlkX2dlbmVyYXRlX3Y0KCkiKSkgQGRiLlV1aWQKICBhZ2VudElkICAgICAgICBTdHJpbmcgICBAZGIuVXVpZAogIHNlbmRlciAgICAgICAgIFN0cmluZz8gIEBkYi5WYXJDaGFyKDI1NSkKICBjb25uZWN0b3IgICAgICBTdHJpbmcgICBAZGIuVmFyQ2hhcigyNTUpCiAgY29udGVudCAgICAgICAgU3RyaW5nPwogIGNvbnZlcnNhdGlvbklkIFN0cmluZz8gIEBkYi5WYXJDaGFyKDI1NSkKICBjcmVhdGVkX2F0ICAgICBEYXRlVGltZSBAZGVmYXVsdChub3coKSkgQGRiLlRpbWVzdGFtcHR6KDYpCiAgdXBkYXRlZF9hdCAgICAgRGF0ZVRpbWUgQGRlZmF1bHQobm93KCkpIEBkYi5UaW1lc3RhbXB0eig2KQogIGFnZW50cyAgICAgICAgIGFnZW50cyAgIEByZWxhdGlvbihmaWVsZHM6IFthZ2VudElkXSwgcmVmZXJlbmNlczogW2lkXSwgb25EZWxldGU6IENhc2NhZGUsIG9uVXBkYXRlOiBOb0FjdGlvbiwgbWFwOiAiY2hhdG1lc3NhZ2VzX2FnZW50aWRfZm9yZWlnbiIpCgogIEBAc2NoZW1hKCJwdWJsaWMiKQp9Cgptb2RlbCBjcmVkZW50aWFscyB7CiAgaWQgICAgICAgICAgICAgICAgU3RyaW5nICAgICAgICAgICAgICBAaWQgQHVuaXF1ZSBAZGVmYXVsdChkYmdlbmVyYXRlZCgidXVpZF9nZW5lcmF0ZV92NCgpIikpIEBkYi5VdWlkCiAgcHJvamVjdElkICAgICAgICAgU3RyaW5nICAgICAgICAgICAgICBAZGIuVmFyQ2hhcigyNTUpCiAgbmFtZSAgICAgICAgICAgICAgU3RyaW5nICAgICAgICAgICAgICBAZGIuVmFyQ2hhcigyNTUpCiAgc2VydmljZVR5cGUgICAgICAgU3RyaW5nICAgICAgICAgICAgICBAZGIuVmFyQ2hhcigyNTUpCiAgY3JlZGVudGlhbFR5cGUgICAgU3RyaW5nCiAgdmFsdWUgICAgICAgICAgICAgU3RyaW5nCiAgZGVzY3JpcHRpb24gICAgICAgU3RyaW5nPwogIG1ldGFkYXRhICAgICAgICAgIEpzb24/CiAgcGx1Z2luTmFtZSAgICAgICAgU3RyaW5nPwogIGNyZWF0ZWRfYXQgICAgICAgIERhdGVUaW1lICAgICAgICAgICAgQGRlZmF1bHQobm93KCkpIEBkYi5UaW1lc3RhbXB0eig2KQogIHVwZGF0ZWRfYXQgICAgICAgIERhdGVUaW1lICAgICAgICAgICAgQGRlZmF1bHQobm93KCkpIEBkYi5UaW1lc3RhbXB0eig2KQogIGFnZW50X2NyZWRlbnRpYWxzIGFnZW50X2NyZWRlbnRpYWxzW10KCiAgQEBzY2hlbWEoInB1YmxpYyIpCn0KCm1vZGVsIGRvY3VtZW50cyB7CiAgaWQgICAgICAgIFN0cmluZyAgQGlkIEBkYi5VdWlkCiAgdHlwZSAgICAgIFN0cmluZz8KICBwcm9qZWN0SWQgU3RyaW5nPwogIGRhdGUgICAgICBTdHJpbmc/CiAgbWV0YWRhdGEgIEpzb24/ICAgQGRlZmF1bHQoInt9IikKCiAgQEBzY2hlbWEoInB1YmxpYyIpCn0KCm1vZGVsIGVtYmVkZGluZ3MgewogIGlkICAgICAgICAgSW50ICAgICAgICAgICAgICAgICAgICBAaWQgQGRlZmF1bHQoYXV0b2luY3JlbWVudCgpKQogIGRvY3VtZW50SWQgU3RyaW5nPyAgICAgICAgICAgICAgICBAZGIuVXVpZAogIGNvbnRlbnQgICAgU3RyaW5nPwogIGVtYmVkZGluZyAgVW5zdXBwb3J0ZWQoInZlY3RvciIpPwogIGluZGV4ICAgICAgSW50PwoKICBAQHNjaGVtYSgicHVibGljIikKfQoKbW9kZWwgcHVibGljX2V2ZW50cyB7CiAgaWQgICAgICAgICAgU3RyaW5nICAgICAgICAgICAgICAgICBAaWQgQGRiLlV1aWQKICB0eXBlICAgICAgICBTdHJpbmc/CiAgb2JzZXJ2ZXIgICAgU3RyaW5nPwogIHNlbmRlciAgICAgIFN0cmluZz8KICBjbGllbnQgICAgICBTdHJpbmc/CiAgY2hhbm5lbCAgICAgU3RyaW5nPwogIGNoYW5uZWxUeXBlIFN0cmluZz8KICBwcm9qZWN0SWQgICBTdHJpbmc/CiAgY29udGVudCAgICAgU3RyaW5nPwogIGFnZW50SWQgICAgIFN0cmluZz8KICBlbnRpdGllcyAgICBTdHJpbmdbXQogIGVtYmVkZGluZyAgIFVuc3VwcG9ydGVkKCJ2ZWN0b3IiKT8KICBkYXRlICAgICAgICBTdHJpbmc/CiAgcmF3RGF0YSAgICAgU3RyaW5nPwogIGNvbm5lY3RvciAgIFN0cmluZz8KCiAgQEBtYXAoImV2ZW50cyIpCiAgQEBzY2hlbWEoInB1YmxpYyIpCn0KCm1vZGVsIGdyYXBoRXZlbnRzIHsKICBpZCAgICAgICAgICAgIFN0cmluZyAgIEBpZCBAZGVmYXVsdChkYmdlbmVyYXRlZCgidXVpZF9nZW5lcmF0ZV92NCgpIikpIEBkYi5VdWlkCiAgYWdlbnRJZCAgICAgICBTdHJpbmcgICBAZGIuVXVpZAogIHNlbmRlciAgICAgICAgU3RyaW5nICAgQGRiLlZhckNoYXIoMjU1KQogIGNvbm5lY3RvciAgICAgU3RyaW5nICAgQGRiLlZhckNoYXIoMjU1KQogIGNvbm5lY3RvckRhdGEgSnNvbj8KICBjb250ZW50ICAgICAgIFN0cmluZwogIGV2ZW50VHlwZSAgICAgU3RyaW5nICAgQGRiLlZhckNoYXIoMjU1KQogIGNyZWF0ZWRfYXQgICAgRGF0ZVRpbWUgQGRlZmF1bHQobm93KCkpIEBkYi5UaW1lc3RhbXB0eig2KQogIHVwZGF0ZWRfYXQgICAgRGF0ZVRpbWUgQGRlZmF1bHQobm93KCkpIEBkYi5UaW1lc3RhbXB0eig2KQogIGV2ZW50ICAgICAgICAgSnNvbj8gICAgQGRlZmF1bHQoInt9IikKICBvYnNlcnZlciAgICAgIFN0cmluZz8gIEBkYi5WYXJDaGFyKDI1NSkKICBjaGFubmVsICAgICAgIFN0cmluZz8gIEBkYi5WYXJDaGFyKDI1NSkKICBhZ2VudHMgICAgICAgIGFnZW50cyAgIEByZWxhdGlvbihmaWVsZHM6IFthZ2VudElkXSwgcmVmZXJlbmNlczogW2lkXSwgb25EZWxldGU6IENhc2NhZGUsIG9uVXBkYXRlOiBOb0FjdGlvbiwgbWFwOiAiZ3JhcGhldmVudHNfYWdlbnRpZF9mb3JlaWduIikKCiAgQEBzY2hlbWEoInB1YmxpYyIpCn0KCm1vZGVsIHB1YmxpY19rbmV4X21pZ3JhdGlvbnMgewogIGlkICAgICAgICAgICAgIEludCAgICAgICBAaWQgQGRlZmF1bHQoYXV0b2luY3JlbWVudCgpKQogIG5hbWUgICAgICAgICAgIFN0cmluZz8gICBAZGIuVmFyQ2hhcigyNTUpCiAgYmF0Y2ggICAgICAgICAgSW50PwogIG1pZ3JhdGlvbl90aW1lIERhdGVUaW1lPyBAZGIuVGltZXN0YW1wdHooNikKCiAgQEBtYXAoImtuZXhfbWlncmF0aW9ucyIpCiAgQEBzY2hlbWEoInB1YmxpYyIpCn0KCm1vZGVsIHB1YmxpY19rbmV4X21pZ3JhdGlvbnNfbG9jayB7CiAgaW5kZXggICAgIEludCAgQGlkIEBkZWZhdWx0KGF1dG9pbmNyZW1lbnQoKSkKICBpc19sb2NrZWQgSW50PwoKICBAQG1hcCgia25leF9taWdyYXRpb25zX2xvY2siKQogIEBAc2NoZW1hKCJwdWJsaWMiKQp9Cgptb2RlbCBrbm93bGVkZ2UgewogIGlkICAgICAgICBTdHJpbmcgICAgQGlkIEBkZWZhdWx0KGRiZ2VuZXJhdGVkKCJ1dWlkX2dlbmVyYXRlX3Y0KCkiKSkgQGRiLlV1aWQKICBuYW1lICAgICAgU3RyaW5nICAgIEBkYi5WYXJDaGFyKDI1NSkKICBzb3VyY2VVcmwgU3RyaW5nPyAgIEBkYi5WYXJDaGFyKDI1NSkKICBkYXRhVHlwZSAgU3RyaW5nPyAgIEBkYi5WYXJDaGFyKDI1NSkKICBkYXRhICAgICAgU3RyaW5nPyAgIEBkYi5WYXJDaGFyKDI1NSkKICBwcm9qZWN0SWQgU3RyaW5nICAgIEBkYi5WYXJDaGFyKDI1NSkKICBtZXRhZGF0YSAgSnNvbj8gICAgIEBkYi5Kc29uCiAgbWVtb3J5SWQgIFN0cmluZz8gICBAZGIuVmFyQ2hhcigyNTUpCiAgY3JlYXRlZEF0IERhdGVUaW1lPyBAZGVmYXVsdChub3coKSkgQGRiLlRpbWVzdGFtcHR6KDYpCiAgdXBkYXRlZEF0IERhdGVUaW1lPyBAZGVmYXVsdChub3coKSkgQGRiLlRpbWVzdGFtcHR6KDYpCgogIEBAc2NoZW1hKCJwdWJsaWMiKQp9Cgptb2RlbCBwbHVnaW5TdGF0ZSB7CiAgaWQgICAgICAgIFN0cmluZyAgICBAaWQgQGRlZmF1bHQoZGJnZW5lcmF0ZWQoInV1aWRfZ2VuZXJhdGVfdjQoKSIpKSBAZGIuVXVpZAogIGFnZW50SWQgICBTdHJpbmc/ICAgQGRiLlV1aWQKICBzdGF0ZSAgICAgSnNvbj8gICAgIEBkYi5Kc29uCiAgcGx1Z2luICAgIFN0cmluZz8gICBAZGIuVmFyQ2hhcigyNTUpCiAgY3JlYXRlZEF0IERhdGVUaW1lPyBAZGVmYXVsdChub3coKSkgQGRiLlRpbWVzdGFtcHR6KDYpCiAgdXBkYXRlZEF0IERhdGVUaW1lPyBAZGVmYXVsdChub3coKSkgQGRiLlRpbWVzdGFtcHR6KDYpCiAgYWdlbnRzICAgIGFnZW50cz8gICBAcmVsYXRpb24oZmllbGRzOiBbYWdlbnRJZF0sIHJlZmVyZW5jZXM6IFtpZF0sIG9uRGVsZXRlOiBDYXNjYWRlLCBvblVwZGF0ZTogTm9BY3Rpb24sIG1hcDogInBsdWdpbnN0YXRlX2FnZW50aWRfZm9yZWlnbiIpCgogIEBAdW5pcXVlKFthZ2VudElkLCBwbHVnaW5dLCBtYXA6ICJwbHVnaW5zdGF0ZV9hZ2VudGlkX3BsdWdpbl91bmlxdWUiKQogIEBAc2NoZW1hKCJwdWJsaWMiKQp9Cgptb2RlbCByZXF1ZXN0IHsKICBpZCAgICAgICAgICAgU3RyaW5nICAgIEBpZCBAZGIuVXVpZAogIHByb2plY3RJZCAgICBTdHJpbmcKICByZXF1ZXN0RGF0YSAgU3RyaW5nPwogIHJlc3BvbnNlRGF0YSBTdHJpbmc/CiAgZHVyYXRpb24gICAgIEludAogIHN0YXR1cyAgICAgICBTdHJpbmc/CiAgc3RhdHVzQ29kZSAgIEludD8KICBtb2RlbCAgICAgICAgU3RyaW5nPwogIHBhcmFtZXRlcnMgICBTdHJpbmc/CiAgY3JlYXRlZEF0ICAgIERhdGVUaW1lPyBAZGVmYXVsdChub3coKSkgQGRiLlRpbWVzdGFtcHR6KDYpCiAgcHJvdmlkZXIgICAgIFN0cmluZwogIHR5cGUgICAgICAgICBTdHJpbmcKICBoaWRkZW4gICAgICAgQm9vbGVhbiAgIEBkZWZhdWx0KGZhbHNlKQogIHByb2Nlc3NlZCAgICBCb29sZWFuICAgQGRlZmF1bHQoZmFsc2UpCiAgY29zdCAgICAgICAgIEZsb2F0PwogIHNwZWxsICAgICAgICBTdHJpbmc/CiAgbm9kZUlkICAgICAgIFN0cmluZz8gICBAZGIuVmFyQ2hhcigyNTUpCiAgYWdlbnRJZCAgICAgIFN0cmluZyAgICBAZGVmYXVsdCgiIikgQGRiLlZhckNoYXIoMjU1KQoKICBAQHNjaGVtYSgicHVibGljIikKfQoKbW9kZWwgc3BlbGxSZWxlYXNlcyB7CiAgaWQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU3RyaW5nICAgIEBpZCBAZGIuVXVpZAogIGRlc2NyaXB0aW9uICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFN0cmluZz8gICBAZGIuVmFyQ2hhcigyNTUpCiAgYWdlbnRJZCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU3RyaW5nICAgIEBkYi5VdWlkCiAgc3BlbGxJZCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU3RyaW5nPyAgIEBkYi5VdWlkCiAgcHJvamVjdElkICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU3RyaW5nPwogIGNyZWF0ZWRBdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIERhdGVUaW1lPyBAZGVmYXVsdChub3coKSkgQGRiLlRpbWVzdGFtcHR6KDYpCiAgYWdlbnRzX2FnZW50c19jdXJyZW50U3BlbGxSZWxlYXNlSWRUb3NwZWxsUmVsZWFzZXMgYWdlbnRzW10gIEByZWxhdGlvbigiYWdlbnRzX2N1cnJlbnRTcGVsbFJlbGVhc2VJZFRvc3BlbGxSZWxlYXNlcyIpCiAgYWdlbnRzX3NwZWxsUmVsZWFzZXNfYWdlbnRJZFRvYWdlbnRzICAgICAgICAgICAgICAgYWdlbnRzICAgIEByZWxhdGlvbigic3BlbGxSZWxlYXNlc19hZ2VudElkVG9hZ2VudHMiLCBmaWVsZHM6IFthZ2VudElkXSwgcmVmZXJlbmNlczogW2lkXSwgb25EZWxldGU6IENhc2NhZGUsIG9uVXBkYXRlOiBOb0FjdGlvbiwgbWFwOiAic3BlbGxyZWxlYXNlc19hZ2VudGlkX2ZvcmVpZ24iKQogIHNwZWxscyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNwZWxsc1tdCgogIEBAc2NoZW1hKCJwdWJsaWMiKQp9Cgptb2RlbCBzcGVsbHMgewogIGlkICAgICAgICAgICAgIFN0cmluZyAgICAgICAgIEBpZCBAZGIuVXVpZAogIG5hbWUgICAgICAgICAgIFN0cmluZz8KICBwcm9qZWN0SWQgICAgICBTdHJpbmc/CiAgZ3JhcGggICAgICAgICAgSnNvbj8KICBjcmVhdGVkQXQgICAgICBTdHJpbmc/CiAgdXBkYXRlZEF0ICAgICAgU3RyaW5nPwogIHR5cGUgICAgICAgICAgIFN0cmluZz8gICAgICAgIEBkYi5WYXJDaGFyKDI1NSkKICBzcGVsbFJlbGVhc2VJZCBTdHJpbmc/ICAgICAgICBAZGIuVXVpZAogIHNwZWxsUmVsZWFzZXMgIHNwZWxsUmVsZWFzZXM/IEByZWxhdGlvbihmaWVsZHM6IFtzcGVsbFJlbGVhc2VJZF0sIHJlZmVyZW5jZXM6IFtpZF0sIG9uRGVsZXRlOiBDYXNjYWRlLCBvblVwZGF0ZTogTm9BY3Rpb24sIG1hcDogInNwZWxsc19zcGVsbHJlbGVhc2VpZF9mb3JlaWduIikKCiAgQEBzY2hlbWEoInB1YmxpYyIpCn0KCm1vZGVsIHRhc2tzIHsKICBpZCAgICAgICAgSW50ICAgICBAaWQgQGRlZmF1bHQoYXV0b2luY3JlbWVudCgpKQogIHN0YXR1cyAgICBTdHJpbmcKICB0eXBlICAgICAgU3RyaW5nCiAgb2JqZWN0aXZlIFN0cmluZwogIGV2ZW50RGF0YSBKc29uICAgIEBkYi5Kc29uCiAgcHJvamVjdElkIFN0cmluZwogIGRhdGUgICAgICBTdHJpbmc/CiAgc3RlcHMgICAgIFN0cmluZwogIGFnZW50SWQgICBTdHJpbmc/CgogIEBAc2NoZW1hKCJwdWJsaWMiKQp9Cgptb2RlbCBXZWJob29rIHsKICBpZCAgICAgICAgU3RyaW5nICAgICAgICBAaWQgQGRlZmF1bHQoZGJnZW5lcmF0ZWQoInV1aWRfZ2VuZXJhdGVfdjQoKSIpKSBAZGIuVXVpZAogIGFnZW50SWQgICBTdHJpbmcgICAgICAgIEBkYi5VdWlkCiAgdXJsICAgICAgIFN0cmluZwogIG1ldGhvZCAgICBXZWJob29rTWV0aG9kCiAgaGVhZGVycyAgIEpzb24/CiAgYm9keSAgICAgIEpzb24/CiAgcmVzcG9uc2UgIEpzb24/CiAgc3RhdHVzICAgIFdlYmhvb2tTdGF0dXMgQGRlZmF1bHQoQUNUSVZFKQogIGNyZWF0ZWRBdCBEYXRlVGltZSAgICAgIEBkZWZhdWx0KG5vdygpKQogIHVwZGF0ZWRBdCBEYXRlVGltZSAgICAgIEB1cGRhdGVkQXQKICBhZ2VudCAgICAgYWdlbnRzICAgICAgICBAcmVsYXRpb24oZmllbGRzOiBbYWdlbnRJZF0sIHJlZmVyZW5jZXM6IFtpZF0sIG9uRGVsZXRlOiBDYXNjYWRlLCBvblVwZGF0ZTogTm9BY3Rpb24sIG1hcDogIndlYmhvb2tfYWdlbnRpZF9mb3JlaWduIikKCiAgQEBzY2hlbWEoInB1YmxpYyIpCn0KCmVudW0gV2ViaG9va01ldGhvZCB7CiAgR0VUCiAgUE9TVAogIFBVVAogIFBBVENICiAgREVMRVRFCiAgT1BUSU9OUwogIEhFQUQKICBDT05ORUNUCiAgVFJBQ0UKCiAgQEBzY2hlbWEoInB1YmxpYyIpCn0KCmVudW0gV2ViaG9va1N0YXR1cyB7CiAgQUNUSVZFCiAgUkVKRUNURUQKICBTVUNDRVNTCiAgRkFJTFVSRQoKICBAQHNjaGVtYSgicHVibGljIikKfQoKbW9kZWwgU2VyYXBoRXZlbnQgewogIGlkICAgICAgICBTdHJpbmcgICAgQGlkIEBkYi5VdWlkCiAgYWdlbnRJZCAgIFN0cmluZyAgICBAZGIuVXVpZAogIHByb2plY3RJZCBTdHJpbmcgICAgQGRiLlZhckNoYXIoMjU1KQogIHR5cGUgICAgICBTdHJpbmcgICAgQGRiLlZhckNoYXIoMjU1KQogIGRhdGEgICAgICBKc29uCiAgY3JlYXRlZEF0IERhdGVUaW1lPyBAZGVmYXVsdChub3coKSkgQGRiLlRpbWVzdGFtcHR6KDYpCgogIEBAc2NoZW1hKCJwdWJsaWMiKQp9Cg==",
  "inlineSchemaHash": "4aa5d1355c13a6914635eaaedf569a65a906c6b2954d7c1b03b036388460a6e4",
  "noEngine": false
}
config.dirname = '/'

config.runtimeDataModel = JSON.parse("{\"models\":{\"agent_credentials\":{\"dbName\":null,\"fields\":[{\"name\":\"agentId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"credentialId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"agents\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"agents\",\"relationName\":\"agent_credentialsToagents\",\"relationFromFields\":[\"agentId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"credentials\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"credentials\",\"relationName\":\"agent_credentialsTocredentials\",\"relationFromFields\":[\"credentialId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":{\"name\":null,\"fields\":[\"agentId\",\"credentialId\"]},\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"agents\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"rootSpell\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"publicVariables\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"secrets\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"enabled\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Boolean\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pingedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"projectId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"data\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"runState\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"stopped\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"image\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"rootSpellId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"default\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"currentSpellReleaseId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"embedModel\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"version\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"1.0\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"embeddingProvider\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"embeddingModel\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isDraft\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"draftAgentId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"agent_credentials\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"agent_credentials\",\"relationName\":\"agent_credentialsToagents\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"spellReleases_agents_currentSpellReleaseIdTospellReleases\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"spellReleases\",\"relationName\":\"agents_currentSpellReleaseIdTospellReleases\",\"relationFromFields\":[\"currentSpellReleaseId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"chatMessages\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"chatMessages\",\"relationName\":\"agentsTochatMessages\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"graphEvents\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"graphEvents\",\"relationName\":\"agentsTographEvents\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pluginState\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"pluginState\",\"relationName\":\"agentsTopluginState\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"spellReleases_spellReleases_agentIdToagents\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"spellReleases\",\"relationName\":\"spellReleases_agentIdToagents\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"Webhook\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Webhook\",\"relationName\":\"WebhookToagents\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"chatMessages\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"agentId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sender\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"connector\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"content\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"conversationId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"agents\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"agents\",\"relationName\":\"agentsTochatMessages\",\"relationFromFields\":[\"agentId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"credentials\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"projectId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"serviceType\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"credentialType\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"value\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metadata\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pluginName\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"agent_credentials\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"agent_credentials\",\"relationName\":\"agent_credentialsTocredentials\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"documents\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"projectId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"date\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metadata\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Json\",\"default\":\"{}\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"embeddings\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"documentId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"content\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"index\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"public_events\":{\"dbName\":\"events\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"observer\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sender\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"client\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"channel\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"channelType\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"projectId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"content\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"agentId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"entities\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"date\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"rawData\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"connector\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"graphEvents\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"agentId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sender\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"connector\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"connectorData\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"content\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"eventType\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"event\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Json\",\"default\":\"{}\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"observer\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"channel\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"agents\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"agents\",\"relationName\":\"agentsTographEvents\",\"relationFromFields\":[\"agentId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"public_knex_migrations\":{\"dbName\":\"knex_migrations\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"batch\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"migration_time\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"public_knex_migrations_lock\":{\"dbName\":\"knex_migrations_lock\",\"fields\":[{\"name\":\"index\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"is_locked\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"knowledge\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sourceUrl\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dataType\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"data\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"projectId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metadata\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"memoryId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"pluginState\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"agentId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"state\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"plugin\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"agents\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"agents\",\"relationName\":\"agentsTopluginState\",\"relationFromFields\":[\"agentId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"agentId\",\"plugin\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"agentId\",\"plugin\"]}],\"isGenerated\":false},\"request\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"projectId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"requestData\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"responseData\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"duration\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"statusCode\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"model\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"parameters\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"provider\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"hidden\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"processed\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cost\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"spell\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"nodeId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"agentId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"spellReleases\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"agentId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"spellId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"projectId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"agents_agents_currentSpellReleaseIdTospellReleases\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"agents\",\"relationName\":\"agents_currentSpellReleaseIdTospellReleases\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"agents_spellReleases_agentIdToagents\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"agents\",\"relationName\":\"spellReleases_agentIdToagents\",\"relationFromFields\":[\"agentId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"spells\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"spells\",\"relationName\":\"spellReleasesTospells\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"spells\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"projectId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"graph\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"spellReleaseId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"spellReleases\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"spellReleases\",\"relationName\":\"spellReleasesTospells\",\"relationFromFields\":[\"spellReleaseId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"tasks\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"objective\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"eventData\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"projectId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"date\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"steps\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"agentId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Webhook\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"agentId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"url\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"method\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"WebhookMethod\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"headers\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"body\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"response\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"WebhookStatus\",\"default\":\"ACTIVE\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"agent\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"agents\",\"relationName\":\"WebhookToagents\",\"relationFromFields\":[\"agentId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"SeraphEvent\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"agentId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"projectId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"data\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false}},\"enums\":{\"WebhookMethod\":{\"values\":[{\"name\":\"GET\",\"dbName\":null},{\"name\":\"POST\",\"dbName\":null},{\"name\":\"PUT\",\"dbName\":null},{\"name\":\"PATCH\",\"dbName\":null},{\"name\":\"DELETE\",\"dbName\":null},{\"name\":\"OPTIONS\",\"dbName\":null},{\"name\":\"HEAD\",\"dbName\":null},{\"name\":\"CONNECT\",\"dbName\":null},{\"name\":\"TRACE\",\"dbName\":null}],\"dbName\":null},\"WebhookStatus\":{\"values\":[{\"name\":\"ACTIVE\",\"dbName\":null},{\"name\":\"REJECTED\",\"dbName\":null},{\"name\":\"SUCCESS\",\"dbName\":null},{\"name\":\"FAILURE\",\"dbName\":null}],\"dbName\":null}},\"types\":{}}")
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

