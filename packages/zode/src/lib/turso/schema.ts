import { makeApi, Zodios, type ZodiosOptions } from '@zodios/core'
import { z } from 'zod'

const Database = z
  .object({
    Name: z.string(),
    DbId: z.string(),
    Hostname: z.string(),
    block_reads: z.boolean(),
    block_writes: z.boolean(),
    allow_attach: z.boolean(),
    regions: z.array(z.string()),
    primaryRegion: z.string(),
    type: z.string().default('logical'),
    version: z.string(),
    group: z.string(),
    is_schema: z.boolean(),
    schema: z.string(),
    sleeping: z.boolean(),
  })
  .partial()
  .passthrough()
const CreateDatabaseInput = z
  .object({
    name: z.string(),
    group: z.string(),
    seed: z
      .object({
        type: z.enum(['database', 'dump']),
        name: z.string(),
        url: z.string(),
        timestamp: z.string(),
      })
      .partial()
      .passthrough()
      .optional(),
    size_limit: z.string().optional(),
    is_schema: z.boolean().optional(),
    schema: z.string().optional(),
  })
  .passthrough()
const DbId = z.string()
const Hostname = z.string()
const Name = z.string()
const CreateDatabaseOutput = z
  .object({ DbId: DbId, Hostname: Hostname, Name: Name })
  .partial()
  .passthrough()
const DatabaseConfigurationResponse = z
  .object({
    size_limit: z.string(),
    allow_attach: z.boolean(),
    block_reads: z.boolean(),
    block_writes: z.boolean(),
  })
  .partial()
  .passthrough()
const DatabaseConfigurationInput = z
  .object({
    size_limit: z.string(),
    allow_attach: z.boolean(),
    block_reads: z.boolean(),
    block_writes: z.boolean(),
  })
  .partial()
  .passthrough()
const Instance = z
  .object({
    uuid: z.string(),
    name: z.string(),
    type: z.enum(['primary', 'replica']),
    region: z.string(),
    hostname: z.string(),
  })
  .partial()
  .passthrough()
const CreateTokenInput = z
  .object({
    permissions: z
      .object({
        read_attach: z
          .object({ databases: z.array(z.string()) })
          .partial()
          .passthrough(),
      })
      .partial()
      .passthrough(),
  })
  .partial()
  .passthrough()
const DatabaseUsageObject = z
  .object({
    rows_read: z.number().int(),
    rows_written: z.number().int(),
    storage_bytes: z.number().int(),
  })
  .partial()
  .passthrough()
const DatabaseUsageOutput = z
  .object({
    uuid: DbId,
    instances: z.array(
      z
        .object({ uuid: z.string(), usage: DatabaseUsageObject })
        .partial()
        .passthrough()
    ),
    total: DatabaseUsageObject,
  })
  .partial()
  .passthrough()
const DatabaseStatsOutput = z
  .object({
    query: z.string(),
    rows_read: z.number().int(),
    rows_written: z.number().int(),
  })
  .partial()
  .passthrough()
const BaseGroup = z
  .object({
    name: z.string(),
    version: z.string(),
    uuid: z.string(),
    locations: z.array(z.string()),
    primary: z.string(),
    archived: z.boolean(),
  })
  .partial()
  .passthrough()
const Group = BaseGroup.and(z.object({}).partial().passthrough())
const Extensions = z.union([
  z.literal('all'),
  z.array(
    z.enum([
      'vector',
      'vss',
      'crypto',
      'fuzzy',
      'math',
      'stats',
      'text',
      'unicode',
      'uuid',
      'regexp',
    ])
  ),
])
const NewGroup = z
  .object({
    name: z.string(),
    location: z.string(),
    extensions: Extensions.optional(),
  })
  .passthrough()
const Organization = z
  .object({
    name: z.string(),
    slug: z.string(),
    type: z.enum(['personal', 'team']),
    overages: z.boolean(),
    blocked_reads: z.boolean(),
    blocked_writes: z.boolean(),
  })
  .partial()
  .passthrough()
const PlanQuotas = z
  .object({
    rowsRead: z.number().int(),
    rowsWritten: z.number().int(),
    databases: z.number().int(),
    locations: z.number().int(),
    storage: z.number().int(),
    groups: z.number().int(),
    bytesSynced: z.number().int(),
  })
  .partial()
  .passthrough()
const Member = z
  .object({
    username: z.string(),
    role: z.enum(['owner', 'admin', 'member']),
    email: z.string(),
  })
  .partial()
  .passthrough()
const addOrganizationMember_Body = z
  .object({
    username: z.string().optional(),
    role: z.enum(['admin', 'member']).optional().default('member'),
  })
  .passthrough()
const username = z.string()
const role = z.enum(['owner', 'admin', 'member'])
const Invite = z
  .object({
    ID: z.number().int(),
    CreatedAt: z.string(),
    UpdatedAt: z.string(),
    DeletedAt: z.string(),
    Role: z.enum(['admin', 'member']),
    Email: z.string(),
    OrganizationID: z.number().int(),
    Token: z.string(),
    Organization: Organization,
    Accepted: z.boolean(),
  })
  .partial()
  .passthrough()
const inviteOrganizationMember_Body = z
  .object({
    email: z.string(),
    role: z.enum(['admin', 'member']).optional().default('member'),
  })
  .passthrough()
const APIToken = z
  .object({ name: z.string(), id: z.string() })
  .partial()
  .passthrough()
const name = z.string()
const id = z.string()
const AuditLog = z
  .object({
    code: z.enum([
      'user-signup',
      'db-create',
      'db-delete',
      'instance-create',
      'instance-delete',
      'org-create',
      'org-delete',
      'org-member-add',
      'org-member-rm',
      'org-member-leave',
      'org-plan-update',
      'org-set-overages',
      'group-create',
      'group-delete',
    ]),
    message: z.string(),
    origin: z.string(),
    author: z.string(),
    created_at: z.string(),
    data: z.object({}).partial().passthrough(),
  })
  .partial()
  .passthrough()

export const schemas = {
  Database,
  CreateDatabaseInput,
  DbId,
  Hostname,
  Name,
  CreateDatabaseOutput,
  DatabaseConfigurationResponse,
  DatabaseConfigurationInput,
  Instance,
  CreateTokenInput,
  DatabaseUsageObject,
  DatabaseUsageOutput,
  DatabaseStatsOutput,
  BaseGroup,
  Group,
  Extensions,
  NewGroup,
  Organization,
  PlanQuotas,
  Member,
  addOrganizationMember_Body,
  username,
  role,
  Invite,
  inviteOrganizationMember_Body,
  APIToken,
  name,
  id,
  AuditLog,
}

export const endpoints = makeApi([
  {
    method: 'get',
    path: '/v1/auth/api-tokens',
    alias: 'listAPITokens',
    description: `Returns a list of API tokens belonging to a user.`,
    requestFormat: 'json',
    response: z
      .object({ tokens: z.array(APIToken) })
      .partial()
      .passthrough(),
  },
  {
    method: 'post',
    path: '/v1/auth/api-tokens/:tokenName',
    alias: 'createAPIToken',
    description: `Returns a new API token belonging to a user.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'tokenName',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z
      .object({ name: name, id: id, token: z.string() })
      .partial()
      .passthrough(),
  },
  {
    method: 'delete',
    path: '/v1/auth/api-tokens/:tokenName',
    alias: 'revokeAPIToken',
    description: `Revokes the provided API token belonging to a user.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'tokenName',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.object({ token: z.string() }).partial().passthrough(),
  },
  {
    method: 'get',
    path: '/v1/auth/validate',
    alias: 'validateAPIToken',
    description: `Validates an API token belonging to a user.`,
    requestFormat: 'json',
    response: z.object({ exp: z.number().int() }).partial().passthrough(),
  },
  {
    method: 'get',
    path: '/v1/locations',
    alias: 'listLocations',
    description: `Returns a list of locations where you can create or replicate databases.`,
    requestFormat: 'json',
    response: z
      .object({ locations: z.record(z.string()) })
      .partial()
      .passthrough(),
  },
  {
    method: 'get',
    path: '/v1/organizations',
    alias: 'listOrganizations',
    description: `Returns a list of organizations the authenticated user owns or is a member of.`,
    requestFormat: 'json',
    response: z.array(Organization),
  },
  {
    method: 'patch',
    path: '/v1/organizations/:organizationName',
    alias: 'updateOrganization',
    description: `Update an organization you own or are a member of.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        description: `The updated organization details.`,
        type: 'Body',
        schema: z.object({ overages: z.boolean() }).partial().passthrough(),
      },
      {
        name: 'organizationName',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.object({ organization: Organization }).partial().passthrough(),
  },
  {
    method: 'get',
    path: '/v1/organizations/:organizationName/audit-logs',
    alias: 'listOrganizationAuditLogs',
    description: `Return the audit logs for the given organization, ordered by the &#x60;created_at&#x60; field in descending order.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'organizationName',
        type: 'Path',
        schema: z.string(),
      },
      {
        name: 'page_size',
        type: 'Query',
        schema: z.number().int().optional(),
      },
      {
        name: 'page',
        type: 'Query',
        schema: z.number().int().optional(),
      },
    ],
    response: z
      .object({
        audit_logs: z.array(AuditLog),
        pagination: z
          .object({
            page: z.number().int(),
            page_size: z.number().int(),
            total_pages: z.number().int(),
            total_rows: z.number().int(),
          })
          .partial()
          .passthrough(),
      })
      .partial()
      .passthrough(),
  },
  {
    method: 'get',
    path: '/v1/organizations/:organizationName/databases',
    alias: 'listDatabases',
    description: `Returns a list of databases belonging to the organization or user.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'organizationName',
        type: 'Path',
        schema: z.string(),
      },
      {
        name: 'group',
        type: 'Query',
        schema: z.string().optional(),
      },
    ],
    response: z
      .object({ databases: z.array(Database) })
      .partial()
      .passthrough(),
  },
  {
    method: 'post',
    path: '/v1/organizations/:organizationName/databases',
    alias: 'createDatabase',
    description: `Creates a new database in a group for the organization or user.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        description: `Database data to create a new database`,
        type: 'Body',
        schema: CreateDatabaseInput,
      },
      {
        name: 'organizationName',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z
      .object({ database: CreateDatabaseOutput })
      .partial()
      .passthrough(),
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.object({ error: z.string() }).partial().passthrough(),
      },
      {
        status: 409,
        description: `Conflict`,
        schema: z.object({ error: z.string() }).partial().passthrough(),
      },
    ],
  },
  {
    method: 'get',
    path: '/v1/organizations/:organizationName/databases/:databaseName',
    alias: 'getDatabase',
    description: `Returns a database belonging to the organization or user.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'organizationName',
        type: 'Path',
        schema: z.string(),
      },
      {
        name: 'databaseName',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.object({ database: Database }).partial().passthrough(),
    errors: [
      {
        status: 404,
        description: `Database not found`,
        schema: z.object({ error: z.string() }).partial().passthrough(),
      },
    ],
  },
  {
    method: 'delete',
    path: '/v1/organizations/:organizationName/databases/:databaseName',
    alias: 'deleteDatabase',
    description: `Delete a database belonging to the organization or user.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'organizationName',
        type: 'Path',
        schema: z.string(),
      },
      {
        name: 'databaseName',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.object({ database: z.string() }).partial().passthrough(),
    errors: [
      {
        status: 404,
        description: `Database not found`,
        schema: z.object({ error: z.string() }).partial().passthrough(),
      },
    ],
  },
  {
    method: 'post',
    path: '/v1/organizations/:organizationName/databases/:databaseName/auth/rotate',
    alias: 'invalidateDatabaseTokens',
    description: `Invalidates all authorization tokens for the specified database.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'organizationName',
        type: 'Path',
        schema: z.string(),
      },
      {
        name: 'databaseName',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 404,
        description: `Database not found`,
        schema: z.object({ error: z.string() }).partial().passthrough(),
      },
    ],
  },
  {
    method: 'post',
    path: '/v1/organizations/:organizationName/databases/:databaseName/auth/tokens',
    alias: 'createDatabaseToken',
    description: `Generates an authorization token for the specified database.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        description: `Additional context such as claims required for the token.`,
        type: 'Body',
        schema: CreateTokenInput.optional(),
      },
      {
        name: 'organizationName',
        type: 'Path',
        schema: z.string(),
      },
      {
        name: 'databaseName',
        type: 'Path',
        schema: z.string(),
      },
      {
        name: 'expiration',
        type: 'Query',
        schema: z.string().optional().default('never'),
      },
      {
        name: 'authorization',
        type: 'Query',
        schema: z
          .enum(['full-access', 'read-only'])
          .optional()
          .default('full-access'),
      },
    ],
    response: z.object({ jwt: z.string() }).partial().passthrough(),
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.object({ error: z.string() }).partial().passthrough(),
      },
      {
        status: 404,
        description: `Database not found`,
        schema: z.object({ error: z.string() }).partial().passthrough(),
      },
    ],
  },
  {
    method: 'get',
    path: '/v1/organizations/:organizationName/databases/:databaseName/configuration',
    alias: 'getDatabaseConfiguration',
    description: `Retrieve an individual database configuration belonging to the organization or user.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'organizationName',
        type: 'Path',
        schema: z.string(),
      },
      {
        name: 'databaseName',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: DatabaseConfigurationResponse,
  },
  {
    method: 'patch',
    path: '/v1/organizations/:organizationName/databases/:databaseName/configuration',
    alias: 'updateDatabaseConfiguration',
    description: `Update a database configuration belonging to the organization or user.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        description: `The configuration to be applied to the chosen database.`,
        type: 'Body',
        schema: DatabaseConfigurationInput,
      },
      {
        name: 'organizationName',
        type: 'Path',
        schema: z.string(),
      },
      {
        name: 'databaseName',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: DatabaseConfigurationResponse,
  },
  {
    method: 'get',
    path: '/v1/organizations/:organizationName/databases/:databaseName/instances',
    alias: 'listDatabaseInstances',
    description: `Returns a list of instances of a database. Instances are the individual primary or replica databases in each region defined by the group.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'organizationName',
        type: 'Path',
        schema: z.string(),
      },
      {
        name: 'databaseName',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z
      .object({ instances: z.array(Instance) })
      .partial()
      .passthrough(),
  },
  {
    method: 'get',
    path: '/v1/organizations/:organizationName/databases/:databaseName/instances/:instanceName',
    alias: 'getDatabaseInstance',
    description: `Return the individual database instance by name.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'organizationName',
        type: 'Path',
        schema: z.string(),
      },
      {
        name: 'databaseName',
        type: 'Path',
        schema: z.string(),
      },
      {
        name: 'instanceName',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.object({ instance: Instance }).partial().passthrough(),
  },
  {
    method: 'get',
    path: '/v1/organizations/:organizationName/databases/:databaseName/stats',
    alias: 'getDatabaseStats',
    description: `Fetch the top queries of a database, including the count of rows read and written.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'organizationName',
        type: 'Path',
        schema: z.string(),
      },
      {
        name: 'databaseName',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z
      .object({ top_queries: z.array(DatabaseStatsOutput) })
      .partial()
      .passthrough(),
    errors: [
      {
        status: 404,
        description: `Database not found`,
        schema: z.object({ error: z.string() }).partial().passthrough(),
      },
    ],
  },
  {
    method: 'get',
    path: '/v1/organizations/:organizationName/databases/:databaseName/usage',
    alias: 'getDatabaseUsage',
    description: `Fetch activity usage for a database in a given time period.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'organizationName',
        type: 'Path',
        schema: z.string(),
      },
      {
        name: 'databaseName',
        type: 'Path',
        schema: z.string(),
      },
      {
        name: 'from',
        type: 'Query',
        schema: z.string().datetime({ offset: true }).optional(),
      },
      {
        name: 'to',
        type: 'Query',
        schema: z.string().datetime({ offset: true }).optional(),
      },
    ],
    response: z
      .object({ database: DatabaseUsageOutput })
      .partial()
      .passthrough(),
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.object({ error: z.string() }).partial().passthrough(),
      },
      {
        status: 404,
        description: `Database not found`,
        schema: z.object({ error: z.string() }).partial().passthrough(),
      },
    ],
  },
  {
    method: 'post',
    path: '/v1/organizations/:organizationName/databases/dumps',
    alias: 'uploadDatabaseDump',
    description: `Upload a SQL dump to be used when [creating a new database](/api-reference/databases/create) from seed.`,
    requestFormat: 'form-data',
    parameters: [
      {
        name: 'body',
        description: `Database dump file to be uploaded.`,
        type: 'Body',
        schema: z.object({ file: z.instanceof(File) }).passthrough(),
      },
      {
        name: 'organizationName',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.object({ dump_url: z.string().url() }).partial().passthrough(),
  },
  {
    method: 'get',
    path: '/v1/organizations/:organizationName/groups',
    alias: 'listGroups',
    description: `Returns a list of groups belonging to the organization or user.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'organizationName',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z
      .object({ groups: z.array(Group) })
      .partial()
      .passthrough(),
  },
  {
    method: 'post',
    path: '/v1/organizations/:organizationName/groups',
    alias: 'createGroup',
    description: `Creates a new group for the organization or user.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        description: `Group data to create a new group`,
        type: 'Body',
        schema: NewGroup,
      },
      {
        name: 'organizationName',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.object({ group: Group }).partial().passthrough(),
    errors: [
      {
        status: 409,
        description: `Conflict`,
        schema: z.object({ error: z.string() }).partial().passthrough(),
      },
    ],
  },
  {
    method: 'get',
    path: '/v1/organizations/:organizationName/groups/:groupName',
    alias: 'getGroup',
    description: `Returns a group belonging to the organization or user.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'organizationName',
        type: 'Path',
        schema: z.string(),
      },
      {
        name: 'groupName',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.object({ group: Group }).partial().passthrough(),
    errors: [
      {
        status: 404,
        description: `Group not found`,
        schema: z.object({ error: z.string() }).partial().passthrough(),
      },
    ],
  },
  {
    method: 'delete',
    path: '/v1/organizations/:organizationName/groups/:groupName',
    alias: 'deleteGroup',
    description: `Delete a group belonging to the organization or user.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'organizationName',
        type: 'Path',
        schema: z.string(),
      },
      {
        name: 'groupName',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.object({ group: Group }).partial().passthrough(),
    errors: [
      {
        status: 404,
        description: `Group not found`,
        schema: z.object({ error: z.string() }).partial().passthrough(),
      },
    ],
  },
  {
    method: 'post',
    path: '/v1/organizations/:organizationName/groups/:groupName/auth/rotate',
    alias: 'invalidateGroupTokens',
    description: `Invalidates all authorization tokens for the specified group.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'organizationName',
        type: 'Path',
        schema: z.string(),
      },
      {
        name: 'groupName',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 404,
        description: `Group not found`,
        schema: z.object({ error: z.string() }).partial().passthrough(),
      },
    ],
  },
  {
    method: 'post',
    path: '/v1/organizations/:organizationName/groups/:groupName/auth/tokens',
    alias: 'createGroupToken',
    description: `Generates an authorization token for the specified group.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        description: `Additional context such as claims required for the token.`,
        type: 'Body',
        schema: CreateTokenInput.optional(),
      },
      {
        name: 'organizationName',
        type: 'Path',
        schema: z.string(),
      },
      {
        name: 'groupName',
        type: 'Path',
        schema: z.string(),
      },
      {
        name: 'expiration',
        type: 'Query',
        schema: z.string().optional().default('never'),
      },
      {
        name: 'authorization',
        type: 'Query',
        schema: z
          .enum(['full-access', 'read-only'])
          .optional()
          .default('full-access'),
      },
    ],
    response: z.object({ jwt: z.string() }).partial().passthrough(),
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.object({ error: z.string() }).partial().passthrough(),
      },
      {
        status: 404,
        description: `Group not found`,
        schema: z.object({ error: z.string() }).partial().passthrough(),
      },
    ],
  },
  {
    method: 'post',
    path: '/v1/organizations/:organizationName/groups/:groupName/locations/:location',
    alias: 'addLocationToGroup',
    description: `Adds a location to the specified group.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'organizationName',
        type: 'Path',
        schema: z.string(),
      },
      {
        name: 'groupName',
        type: 'Path',
        schema: z.string(),
      },
      {
        name: 'location',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.object({ group: Group }).partial().passthrough(),
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.object({ error: z.string() }).partial().passthrough(),
      },
      {
        status: 404,
        description: `Group not found`,
        schema: z.object({ error: z.string() }).partial().passthrough(),
      },
    ],
  },
  {
    method: 'delete',
    path: '/v1/organizations/:organizationName/groups/:groupName/locations/:location',
    alias: 'removeLocationFromGroup',
    description: `Removes a location from the specified group.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'organizationName',
        type: 'Path',
        schema: z.string(),
      },
      {
        name: 'groupName',
        type: 'Path',
        schema: z.string(),
      },
      {
        name: 'location',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.object({ group: Group }).partial().passthrough(),
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.object({ error: z.string() }).partial().passthrough(),
      },
      {
        status: 404,
        description: `Group not found`,
        schema: z.object({ error: z.string() }).partial().passthrough(),
      },
    ],
  },
  {
    method: 'post',
    path: '/v1/organizations/:organizationName/groups/:groupName/transfer',
    alias: 'transferGroup',
    description: `Transfer a group to another organization that you own or a member of.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        description: `Receiving Organization details.`,
        type: 'Body',
        schema: z.object({ organization: z.string() }).partial().passthrough(),
      },
      {
        name: 'organizationName',
        type: 'Path',
        schema: z.string(),
      },
      {
        name: 'groupName',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: Group,
    errors: [
      {
        status: 404,
        description: `Group not found`,
        schema: z.object({ error: z.string() }).partial().passthrough(),
      },
    ],
  },
  {
    method: 'post',
    path: '/v1/organizations/:organizationName/groups/:groupName/update',
    alias: 'updateGroupDatabases',
    description: `Updates all databases in the group to the latest libSQL version.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'organizationName',
        type: 'Path',
        schema: z.string(),
      },
      {
        name: 'groupName',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 404,
        description: `Group not found`,
        schema: z.object({ error: z.string() }).partial().passthrough(),
      },
    ],
  },
  {
    method: 'get',
    path: '/v1/organizations/:organizationName/invites',
    alias: 'listOrganizationInvites',
    description: `Returns a list of invites for the organization.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'organizationName',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z
      .object({ invites: z.array(Invite) })
      .partial()
      .passthrough(),
  },
  {
    method: 'post',
    path: '/v1/organizations/:organizationName/invites',
    alias: 'inviteOrganizationMember',
    description: `Invite a user (who isn&#x27;t already a Turso user) to an organization.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        description: `The user you want to invite to join Turso, and your organization.`,
        type: 'Body',
        schema: inviteOrganizationMember_Body,
      },
      {
        name: 'organizationName',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.object({ invited: Invite }).partial().passthrough(),
  },
  {
    method: 'delete',
    path: '/v1/organizations/:organizationName/invites/:email',
    alias: 'deleteOrganizationInviteByEmail',
    description: `Delete an invite for the organization by email.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'organizationName',
        type: 'Path',
        schema: z.string(),
      },
      {
        name: 'email',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 404,
        description: `Invite not found`,
        schema: z
          .object({ code: z.string(), error: z.string() })
          .partial()
          .passthrough(),
      },
    ],
  },
  {
    method: 'get',
    path: '/v1/organizations/:organizationName/invoices',
    alias: 'listOrganizationInvoices',
    description: `Returns a list of invoices for the organization.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'organizationName',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z
      .object({
        invoices: z.array(
          z
            .object({
              invoice_number: z.string(),
              amount_due: z.string(),
              due_date: z.string(),
              paid_at: z.string(),
              payment_failed_at: z.string(),
              invoice_pdf: z.string(),
            })
            .partial()
            .passthrough()
        ),
      })
      .partial()
      .passthrough(),
  },
  {
    method: 'get',
    path: '/v1/organizations/:organizationName/members',
    alias: 'listOrganizationMembers',
    description: `Returns a list of members part of the organization.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'organizationName',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z
      .object({ members: z.array(Member) })
      .partial()
      .passthrough(),
  },
  {
    method: 'post',
    path: '/v1/organizations/:organizationName/members',
    alias: 'addOrganizationMember',
    description: `Add an existing Turso user to an organization.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        description: `The member you want to add.`,
        type: 'Body',
        schema: addOrganizationMember_Body,
      },
      {
        name: 'organizationName',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z
      .object({ member: username, role: role })
      .partial()
      .passthrough(),
    errors: [
      {
        status: 404,
        description: `Member not found`,
        schema: z.object({ error: z.string() }).partial().passthrough(),
      },
      {
        status: 409,
        description: `Conflict`,
        schema: z.object({ error: z.string() }).partial().passthrough(),
      },
    ],
  },
  {
    method: 'delete',
    path: '/v1/organizations/:organizationName/members/:username',
    alias: 'removeOrganizationMember',
    description: `Remove a user from the organization by username.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'organizationName',
        type: 'Path',
        schema: z.string(),
      },
      {
        name: 'username',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.object({ member: username }).partial().passthrough(),
    errors: [
      {
        status: 404,
        description: `Member not found`,
        schema: z.object({ error: z.string() }).partial().passthrough(),
      },
    ],
  },
  {
    method: 'get',
    path: '/v1/organizations/:organizationName/plans',
    alias: 'listOrganizationPlans',
    description: `Returns a list of available plans and their quotas.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'organizationName',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z
      .object({ name: z.string(), price: z.string(), quotas: PlanQuotas })
      .partial()
      .passthrough(),
  },
  {
    method: 'get',
    path: '/v1/organizations/:organizationName/subscription',
    alias: 'getOrganizationSubscription',
    description: `Returns the current subscription details for the organization.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'organizationName',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z
      .object({
        subscription: z.string(),
        overages: z.boolean(),
        plan: z.string(),
        timeline: z.string(),
      })
      .partial()
      .passthrough(),
  },
  {
    method: 'get',
    path: '/v1/organizations/:organizationName/usage',
    alias: 'getOrganizationUsage',
    description: `Fetch current billing cycle usage for an organization.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'organizationName',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z
      .object({
        organization: z
          .object({
            uuid: z.string(),
            usage: z
              .object({
                rows_read: z.number().int(),
                rows_written: z.number().int(),
                databases: z.number().int(),
                locations: z.number().int(),
                storage: z.number().int(),
                groups: z.number().int(),
                bytes_synced: z.number().int(),
              })
              .partial()
              .passthrough(),
            databases: z.array(DatabaseUsageOutput),
          })
          .partial()
          .passthrough(),
      })
      .partial()
      .passthrough(),
  },
])

export const api = new Zodios(endpoints)

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options)
}
