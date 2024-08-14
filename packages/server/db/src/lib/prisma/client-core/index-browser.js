
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.15.0
 * Query Engine version: 12e25d8d06f6ea5a0252864dd9a03b1bb51f3022
 */
Prisma.prismaVersion = {
  client: "5.15.0",
  engine: "12e25d8d06f6ea5a0252864dd9a03b1bb51f3022"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

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
  name: 'name',
  enabled: 'enabled',
  updatedAt: 'updatedAt',
  projectId: 'projectId',
  worldId: 'worldId',
  data: 'data',
  image: 'image',
  default: 'default',
  createdAt: 'createdAt',
  currentSpellReleaseId: 'currentSpellReleaseId',
  version: 'version',
  embeddingProvider: 'embeddingProvider',
  embeddingModel: 'embeddingModel',
  isDraft: 'isDraft',
  draftAgentId: 'draftAgentId',
  description: 'description',
  rootSpellId: 'rootSpellId',
  secrets: 'secrets',
  rootSpell: 'rootSpell',
  pingedAt: 'pingedAt',
  publicVariables: 'publicVariables',
  embedModel: 'embedModel',
  runState: 'runState'
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
  worldId: 'worldId',
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
  worldId: 'worldId',
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
  worldId: 'worldId',
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
  worldId: 'worldId',
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
  worldId: 'worldId',
  createdAt: 'createdAt'
};

exports.Prisma.SpellsScalarFieldEnum = {
  id: 'id',
  name: 'name',
  projectId: 'projectId',
  worldId: 'worldId',
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
  worldId: 'worldId',
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

exports.Prisma.SeraphEventsScalarFieldEnum = {
  id: 'id',
  agentId: 'agentId',
  projectId: 'projectId',
  worldId: 'worldId',
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

exports.Prisma.Agent_channelsScalarFieldEnum = {
  id: 'id',
  agentId: 'agentId',
  channelKey: 'channelKey',
  channelName: 'channelName',
  initialEvent: 'initialEvent',
  channelActive: 'channelActive',
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
  name: 'name',
  updatedAt: 'updatedAt',
  projectId: 'projectId',
  worldId: 'worldId',
  image: 'image',
  currentSpellReleaseId: 'currentSpellReleaseId',
  version: 'version',
  embeddingProvider: 'embeddingProvider',
  embeddingModel: 'embeddingModel',
  draftAgentId: 'draftAgentId',
  description: 'description',
  rootSpellId: 'rootSpellId',
  secrets: 'secrets',
  pingedAt: 'pingedAt',
  publicVariables: 'publicVariables',
  embedModel: 'embedModel',
  runState: 'runState'
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
  worldId: 'worldId',
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
  worldId: 'worldId',
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
  worldId: 'worldId',
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
  worldId: 'worldId',
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
  projectId: 'projectId',
  worldId: 'worldId'
};

exports.Prisma.spellsOrderByRelevanceFieldEnum = {
  id: 'id',
  name: 'name',
  projectId: 'projectId',
  worldId: 'worldId',
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
  worldId: 'worldId',
  date: 'date',
  steps: 'steps',
  agentId: 'agentId'
};

exports.Prisma.WebhookOrderByRelevanceFieldEnum = {
  id: 'id',
  agentId: 'agentId',
  url: 'url'
};

exports.Prisma.seraphEventsOrderByRelevanceFieldEnum = {
  id: 'id',
  agentId: 'agentId',
  projectId: 'projectId',
  worldId: 'worldId',
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

exports.Prisma.agent_channelsOrderByRelevanceFieldEnum = {
  id: 'id',
  agentId: 'agentId',
  channelKey: 'channelKey',
  channelName: 'channelName'
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
  seraphEvents: 'seraphEvents',
  Memory: 'Memory',
  agent_channels: 'agent_channels'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
