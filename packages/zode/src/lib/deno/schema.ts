import { makeApi, Zodios, type ZodiosOptions } from '@zodios/core'
import { z } from 'zod'

const Organization = z
  .object({
    id: z.string().uuid(),
    name: z.string(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
  })
  .passthrough()
const ErrorBody = z
  .object({ code: z.string(), message: z.string() })
  .passthrough()
const AnalyticsFieldType = z.enum([
  'time',
  'number',
  'string',
  'boolean',
  'other',
])
const AnalyticsFieldSchema = z
  .object({ name: z.string(), type: AnalyticsFieldType })
  .passthrough()
const AnalyticsDataValue = z.union([
  z.string(),
  z.number(),
  z.string(),
  z.boolean(),
  z.unknown(),
])
const Analytics = z
  .object({
    fields: z.array(AnalyticsFieldSchema),
    values: z.array(z.array(AnalyticsDataValue)),
  })
  .passthrough()
const Project = z
  .object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string().max(1000),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
  })
  .passthrough()
const CreateProjectRequest = z
  .object({
    name: z.string().nullable(),
    description: z.string().max(1000).nullable(),
  })
  .partial()
  .passthrough()
const KvDatabase = z
  .object({
    id: z.string().uuid(),
    organizationId: z.string().uuid(),
    description: z.string(),
    updatedAt: z.string().datetime({ offset: true }),
    createdAt: z.string().datetime({ offset: true }),
  })
  .passthrough()
const CreateKvDatabaseRequest = z
  .object({ description: z.string().max(1000).nullable() })
  .partial()
  .passthrough()
const UpdateKvDatabaseRequest = z
  .object({ description: z.string().max(1000).nullable() })
  .partial()
  .passthrough()
const UpdateProjectRequest = z
  .object({
    name: z.string().nullable(),
    description: z.string().max(1000).nullable(),
  })
  .partial()
  .passthrough()
const DeploymentId = z.string()
const DeploymentStatus = z.enum(['failed', 'pending', 'success'])
const DeploymentPermissions = z
  .object({ net: z.array(z.string()).nullable() })
  .partial()
  .passthrough()
const Deployment = z
  .object({
    id: DeploymentId,
    projectId: z.string().uuid(),
    description: z.string().nullish(),
    status: DeploymentStatus,
    domains: z.array(z.string()).nullish(),
    databases: z.record(z.string().uuid()),
    requestTimeout: z.number().int().gte(1).nullish(),
    permissions: DeploymentPermissions.nullish(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
  })
  .passthrough()
const CompilerOptions = z
  .object({
    experimentalDecorators: z.boolean().nullable(),
    jsx: z.string().nullable(),
    jsxFactory: z.string().nullable(),
    jsxFragmentFactory: z.string().nullable(),
    jsxImportSource: z.string().nullable(),
    jsxPrecompileSkipElements: z.array(z.string()).nullable(),
  })
  .partial()
  .passthrough()
const Encoding = z.enum(['utf-8', 'base64'])
const File = z.union([
  z
    .object({ content: z.string(), encoding: Encoding.optional() })
    .passthrough(),
  z.object({ gitSha1: z.string() }).passthrough(),
])
const Symlink = z.object({ target: z.string() }).passthrough()
const Asset = z.union([
  File.and(z.object({ kind: z.literal('file') }).passthrough()),
  Symlink.and(z.object({ kind: z.literal('symlink') }).passthrough()),
])
const Assets = z.record(Asset)
const CreateDeploymentRequest = z
  .object({
    entryPointUrl: z.string(),
    importMapUrl: z.string().nullish(),
    lockFileUrl: z.string().nullish(),
    compilerOptions: CompilerOptions.nullish(),
    assets: Assets,
    envVars: z.record(z.string()),
    databases: z.record(z.string().uuid()).nullish(),
    requestTimeout: z.number().int().gte(1).nullish(),
    permissions: DeploymentPermissions.nullish(),
    description: z.string().max(1000).nullish(),
  })
  .passthrough()
const DeploymentPermissionsOverwrite = z
  .object({ net: z.array(z.string()).nullable() })
  .partial()
  .passthrough()
const RedeployRequest = z
  .object({
    envVars: z.record(z.string().nullable()).nullable(),
    databases: z.record(z.string().uuid().nullable()).nullable(),
    requestTimeout: z.number().int().gte(1).nullable(),
    permissions: DeploymentPermissionsOverwrite.nullable(),
    description: z.string().nullable(),
  })
  .partial()
  .passthrough()
const BuildLogsResponseEntry = z
  .object({ level: z.string(), message: z.string() })
  .passthrough()
const LogLevel = z.enum(['error', 'warning', 'info', 'debug'])
const level = LogLevel.nullish()
const Region = z.enum([
  'gcp-asia-east1',
  'gcp-asia-east2',
  'gcp-asia-northeast1',
  'gcp-asia-northeast2',
  'gcp-asia-northeast3',
  'gcp-asia-south1',
  'gcp-asia-south2',
  'gcp-asia-southeast1',
  'gcp-asia-southeast2',
  'gcp-australia-southeast1',
  'gcp-australia-southeast2',
  'gcp-europe-central2',
  'gcp-europe-north1',
  'gcp-europe-southwest1',
  'gcp-europe-west1',
  'gcp-europe-west2',
  'gcp-europe-west3',
  'gcp-europe-west4',
  'gcp-europe-west6',
  'gcp-europe-west8',
  'gcp-me-west1',
  'gcp-northamerica-northeast1',
  'gcp-northamerica-northeast2',
  'gcp-southamerica-east1',
  'gcp-southamerica-west1',
  'gcp-us-central1',
  'gcp-us-east1',
  'gcp-us-east4',
  'gcp-us-east5',
  'gcp-us-south1',
  'gcp-us-west1',
  'gcp-us-west2',
  'gcp-us-west3',
  'gcp-us-west4',
])
const region = Region.nullish()
const AppLogsResponseEntry = z
  .object({
    time: z.string().datetime({ offset: true }),
    level: LogLevel,
    message: z.string(),
    region: Region,
  })
  .passthrough()
const TlsCipher = z.enum(['rsa', 'ec'])
const DomainCertificate = z
  .object({
    cipher: TlsCipher,
    expiresAt: z.string().datetime({ offset: true }),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
  })
  .passthrough()
const ProvisioningStatus = z.discriminatedUnion('code', [
  z.object({ code: z.literal('success') }).passthrough(),
  z.object({ message: z.string(), code: z.literal('failed') }).passthrough(),
  z.object({ code: z.literal('pending') }).passthrough(),
  z.object({ code: z.literal('manual') }).passthrough(),
])
const DnsRecord = z
  .object({ type: z.string(), name: z.string(), content: z.string() })
  .passthrough()
const Domain = z
  .object({
    id: z.string().uuid(),
    organizationId: z.string().uuid(),
    domain: z.string(),
    token: z.string(),
    isValidated: z.boolean(),
    certificates: z.array(DomainCertificate),
    provisioningStatus: ProvisioningStatus,
    projectId: z.string().uuid().nullish(),
    deploymentId: DeploymentId.nullish(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
    dnsRecords: z.array(DnsRecord),
  })
  .passthrough()
const CreateDomainRequest = z.object({ domain: z.string() }).passthrough()
const UpdateDomainAssociationRequest = z
  .object({ deploymentId: DeploymentId.nullable() })
  .partial()
  .passthrough()
const AddDomainCertificateRequest = z
  .object({ privateKey: z.string(), certificateChain: z.string() })
  .passthrough()

export const schemas = {
  Organization,
  ErrorBody,
  AnalyticsFieldType,
  AnalyticsFieldSchema,
  AnalyticsDataValue,
  Analytics,
  Project,
  CreateProjectRequest,
  KvDatabase,
  CreateKvDatabaseRequest,
  UpdateKvDatabaseRequest,
  UpdateProjectRequest,
  DeploymentId,
  DeploymentStatus,
  DeploymentPermissions,
  Deployment,
  CompilerOptions,
  Encoding,
  File,
  Symlink,
  Asset,
  Assets,
  CreateDeploymentRequest,
  DeploymentPermissionsOverwrite,
  RedeployRequest,
  BuildLogsResponseEntry,
  LogLevel,
  level,
  Region,
  region,
  AppLogsResponseEntry,
  TlsCipher,
  DomainCertificate,
  ProvisioningStatus,
  DnsRecord,
  Domain,
  CreateDomainRequest,
  UpdateDomainAssociationRequest,
  AddDomainCertificateRequest,
}

export const endpoints = makeApi([
  {
    method: 'patch',
    path: '/databases/:databaseId',
    alias: 'update_kv_database',
    description: `Update KV database details`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: z
          .object({ description: z.string().max(1000).nullable() })
          .partial()
          .passthrough(),
      },
      {
        name: 'databaseId',
        type: 'Path',
        schema: z.string().uuid(),
      },
    ],
    response: KvDatabase,
    errors: [
      {
        status: 400,
        description: `Invalid Request`,
        schema: ErrorBody,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: ErrorBody,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: ErrorBody,
      },
    ],
  },
  {
    method: 'get',
    path: '/deployments/:deploymentId',
    alias: 'get_deployment',
    description: `Get deployment details`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'deploymentId',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: Deployment,
    errors: [
      {
        status: 400,
        description: `Invalid Request`,
        schema: ErrorBody,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: ErrorBody,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: ErrorBody,
      },
    ],
  },
  {
    method: 'delete',
    path: '/deployments/:deploymentId',
    alias: 'delete_deployment',
    description: `Delete a deployment`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'deploymentId',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `Invalid Request`,
        schema: ErrorBody,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: ErrorBody,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: ErrorBody,
      },
    ],
  },
  {
    method: 'get',
    path: '/deployments/:deploymentId/app_logs',
    alias: 'get_app_logs',
    description: `Get execution logs of a deployment

This API can return either past logs or real-time logs depending on the
presence of the since and until query parameters; if at least one of them
is provided, past logs are returned, otherwise real-time logs are returned.

Also, the response format can be controlled by the &#x60;Accept&#x60; header; if
&#x60;application/x-ndjson&#x60; is specified, the response will be a stream of
newline-delimited JSON objects. Otherwise it will be a JSON array of
objects.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'q',
        type: 'Query',
        schema: z.string().nullish(),
      },
      {
        name: 'level',
        type: 'Query',
        schema: level,
      },
      {
        name: 'region',
        type: 'Query',
        schema: region,
      },
      {
        name: 'since',
        type: 'Query',
        schema: z.string().datetime({ offset: true }).nullish(),
      },
      {
        name: 'until',
        type: 'Query',
        schema: z.string().datetime({ offset: true }).nullish(),
      },
      {
        name: 'limit',
        type: 'Query',
        schema: z.number().int().gte(1).lte(10000).nullish().default(100),
      },
      {
        name: 'sort',
        type: 'Query',
        schema: z.string().nullish(),
      },
      {
        name: 'order',
        type: 'Query',
        schema: z.string().nullish(),
      },
      {
        name: 'cursor',
        type: 'Query',
        schema: z.string().nullish(),
      },
      {
        name: 'deploymentId',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.array(AppLogsResponseEntry),
    errors: [
      {
        status: 400,
        description: `Invalid Request`,
        schema: ErrorBody,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: ErrorBody,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: ErrorBody,
      },
    ],
  },
  {
    method: 'get',
    path: '/deployments/:deploymentId/build_logs',
    alias: 'get_build_logs',
    description: `Get build logs of a deployment

This API returns build logs of the specified deployment. It&#x27;s useful to watch
the build progress, figure out what went wrong in case of a build failure,
and so on.

The response format can be controlled by the &#x60;Accept&#x60; header; if
&#x60;application/x-ndjson&#x60; is specified, the response will be a stream of
newline-delimited JSON objects. Otherwise it will be a JSON array of
objects.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'deploymentId',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.array(BuildLogsResponseEntry),
    errors: [
      {
        status: 400,
        description: `Invalid Request`,
        schema: ErrorBody,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: ErrorBody,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: ErrorBody,
      },
    ],
  },
  {
    method: 'post',
    path: '/deployments/:deploymentId/redeploy',
    alias: 'redeploy_deployment',
    description: `Redeploy a deployment with different configuration`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: RedeployRequest,
      },
      {
        name: 'deploymentId',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: Deployment,
    errors: [
      {
        status: 400,
        description: `Invalid Request`,
        schema: ErrorBody,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: ErrorBody,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: ErrorBody,
      },
    ],
  },
  {
    method: 'get',
    path: '/domains/:domainId',
    alias: 'get_domain',
    description: `Get domain details`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'domainId',
        type: 'Path',
        schema: z.string().uuid(),
      },
    ],
    response: Domain,
    errors: [
      {
        status: 400,
        description: `Invalid Request`,
        schema: ErrorBody,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: ErrorBody,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: ErrorBody,
      },
    ],
  },
  {
    method: 'patch',
    path: '/domains/:domainId',
    alias: 'update_domain_association',
    description: `Associate a domain with a deployment

This API allows you to either:

1. associate a domain with a deployment, or
2. disassociate a domain from a deployment

Domain association is required in order to serve the deployment on the
domain.

If the ownership of the domain is not verified yet, this API will trigger
the verification process before associating the domain with the deployment.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: UpdateDomainAssociationRequest,
      },
      {
        name: 'domainId',
        type: 'Path',
        schema: z.string().uuid(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `Invalid Request`,
        schema: ErrorBody,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: ErrorBody,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: ErrorBody,
      },
    ],
  },
  {
    method: 'delete',
    path: '/domains/:domainId',
    alias: 'delete_domain',
    description: `Delete a domain`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'domainId',
        type: 'Path',
        schema: z.string().uuid(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `Invalid Request`,
        schema: ErrorBody,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: ErrorBody,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: ErrorBody,
      },
    ],
  },
  {
    method: 'post',
    path: '/domains/:domainId/certificates',
    alias: 'add_domain_certificate',
    description: `Upload TLS certificate for a domain

This API allows you to upload a TLS certificate for a domain.

If the ownership of the domain is not verified yet, this API will trigger
the verification process before storing the certificate.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: AddDomainCertificateRequest,
      },
      {
        name: 'domainId',
        type: 'Path',
        schema: z.string().uuid(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `Invalid Request`,
        schema: ErrorBody,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: ErrorBody,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: ErrorBody,
      },
    ],
  },
  {
    method: 'post',
    path: '/domains/:domainId/certificates/provision',
    alias: 'provision_domain_certificates',
    description: `Provision TLS certificates for a domain

This API begins the provisioning of TLS certificates for a domain.

Note that a call to this API may take a while, up to a minute or so.

If the ownership of the domain is not verified yet, this API will trigger
the verification process before provisioning the certificate.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'domainId',
        type: 'Path',
        schema: z.string().uuid(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `Invalid Request`,
        schema: ErrorBody,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: ErrorBody,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: ErrorBody,
      },
    ],
  },
  {
    method: 'post',
    path: '/domains/:domainId/verify',
    alias: 'verify_domain',
    description: `Verify ownership of a domain

This API triggers the ownership verification of a domain. It should be
called after necessary DNS records are properly set up.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'domainId',
        type: 'Path',
        schema: z.string().uuid(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `Invalid Request`,
        schema: ErrorBody,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: ErrorBody,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: ErrorBody,
      },
    ],
  },
  {
    method: 'get',
    path: '/organizations/:organizationId',
    alias: 'get_organization',
    description: `Get organization details`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'organizationId',
        type: 'Path',
        schema: z.string().uuid(),
      },
    ],
    response: Organization,
    errors: [
      {
        status: 400,
        description: `Invalid Request`,
        schema: ErrorBody,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: ErrorBody,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: ErrorBody,
      },
    ],
  },
  {
    method: 'get',
    path: '/organizations/:organizationId/analytics',
    alias: 'get_organization_analytics',
    description: `Retrieve organization analytics

This API returns analytics for the specified organization.
The analytics are returned as time series data in 15 minute intervals, with
the &#x60;time&#x60; field representing the start of the interval.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'organizationId',
        type: 'Path',
        schema: z.string().uuid(),
      },
      {
        name: 'since',
        type: 'Query',
        schema: z.string().datetime({ offset: true }),
      },
      {
        name: 'until',
        type: 'Query',
        schema: z.string().datetime({ offset: true }),
      },
    ],
    response: Analytics,
    errors: [
      {
        status: 400,
        description: `Invalid Request`,
        schema: ErrorBody,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: ErrorBody,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: ErrorBody,
      },
    ],
  },
  {
    method: 'get',
    path: '/organizations/:organizationId/databases',
    alias: 'list_kv_databases',
    description: `List KV databases of an organization

This API returns a list of KV databases belonging to the specified organization
in a pagenated manner.
The URLs for the next, previous, first, and last page are returned in the
&#x60;Link&#x60; header of the response, if any.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'page',
        type: 'Query',
        schema: z.number().int().gte(1).nullish().default(1),
      },
      {
        name: 'limit',
        type: 'Query',
        schema: z.number().int().gte(1).lte(100).nullish().default(20),
      },
      {
        name: 'q',
        type: 'Query',
        schema: z.string().nullish(),
      },
      {
        name: 'sort',
        type: 'Query',
        schema: z.string().nullish(),
      },
      {
        name: 'order',
        type: 'Query',
        schema: z.string().nullish(),
      },
      {
        name: 'organizationId',
        type: 'Path',
        schema: z.string().uuid(),
      },
    ],
    response: z.array(KvDatabase),
    errors: [
      {
        status: 400,
        description: `Invalid Request`,
        schema: ErrorBody,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: ErrorBody,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: ErrorBody,
      },
    ],
  },
  {
    method: 'post',
    path: '/organizations/:organizationId/databases',
    alias: 'create_kv_database',
    description: `Create a KV database

This API allows you to create a new KV database under the specified
organization. You will then be able to associate the created KV database
with a new deployment by specifying the KV database ID in the &quot;Create a
deployment&quot; API call.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: z
          .object({ description: z.string().max(1000).nullable() })
          .partial()
          .passthrough(),
      },
      {
        name: 'organizationId',
        type: 'Path',
        schema: z.string().uuid(),
      },
    ],
    response: KvDatabase,
    errors: [
      {
        status: 400,
        description: `Invalid Request`,
        schema: ErrorBody,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: ErrorBody,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: ErrorBody,
      },
    ],
  },
  {
    method: 'get',
    path: '/organizations/:organizationId/domains',
    alias: 'list_domains',
    description: `List domains of an organization

This API returns a list of domains belonging to the specified organization
in a pagenated manner.

The URLs for the next, previous, first, and last page are returned in the
&#x60;Link&#x60; header of the response, if any.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'page',
        type: 'Query',
        schema: z.number().int().gte(1).nullish().default(1),
      },
      {
        name: 'limit',
        type: 'Query',
        schema: z.number().int().gte(1).lte(100).nullish().default(20),
      },
      {
        name: 'q',
        type: 'Query',
        schema: z.string().nullish(),
      },
      {
        name: 'sort',
        type: 'Query',
        schema: z.string().nullish(),
      },
      {
        name: 'order',
        type: 'Query',
        schema: z.string().nullish(),
      },
      {
        name: 'organizationId',
        type: 'Path',
        schema: z.string().uuid(),
      },
    ],
    response: z.array(Domain),
    errors: [
      {
        status: 400,
        description: `Invalid Request`,
        schema: ErrorBody,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: ErrorBody,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: ErrorBody,
      },
    ],
  },
  {
    method: 'post',
    path: '/organizations/:organizationId/domains',
    alias: 'create_domain',
    description: `Add a domain to an organization

This API allows you to add a new domain to the specified organization.

Before use, added domain needs to be verified, and also TLS certificates for
the domain need to be provisioned.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: z.object({ domain: z.string() }).passthrough(),
      },
      {
        name: 'organizationId',
        type: 'Path',
        schema: z.string().uuid(),
      },
    ],
    response: Domain,
    errors: [
      {
        status: 400,
        description: `Invalid Request`,
        schema: ErrorBody,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: ErrorBody,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: ErrorBody,
      },
    ],
  },
  {
    method: 'get',
    path: '/organizations/:organizationId/projects',
    alias: 'list_projects',
    description: `List projects of an organization

This API returns a list of projects belonging to the specified organization
in a pagenated manner.
The URLs for the next, previous, first, and last page are returned in the
&#x60;Link&#x60; header of the response, if any.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'page',
        type: 'Query',
        schema: z.number().int().gte(1).nullish().default(1),
      },
      {
        name: 'limit',
        type: 'Query',
        schema: z.number().int().gte(1).lte(100).nullish().default(20),
      },
      {
        name: 'q',
        type: 'Query',
        schema: z.string().nullish(),
      },
      {
        name: 'sort',
        type: 'Query',
        schema: z.string().nullish(),
      },
      {
        name: 'order',
        type: 'Query',
        schema: z.string().nullish(),
      },
      {
        name: 'organizationId',
        type: 'Path',
        schema: z.string().uuid(),
      },
    ],
    response: z.array(Project),
    errors: [
      {
        status: 400,
        description: `Invalid Request`,
        schema: ErrorBody,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: ErrorBody,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: ErrorBody,
      },
    ],
  },
  {
    method: 'post',
    path: '/organizations/:organizationId/projects',
    alias: 'create_project',
    description: `Create a project

This API allows you to create a new project under the specified
organization.
The project name is optional; if not provided, a random name will be
generated.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: CreateProjectRequest,
      },
      {
        name: 'organizationId',
        type: 'Path',
        schema: z.string().uuid(),
      },
    ],
    response: Project,
    errors: [
      {
        status: 400,
        description: `Invalid Request`,
        schema: ErrorBody,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: ErrorBody,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: ErrorBody,
      },
    ],
  },
  {
    method: 'get',
    path: '/projects/:projectId',
    alias: 'get_project',
    description: `Get project details`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'projectId',
        type: 'Path',
        schema: z.string().uuid(),
      },
    ],
    response: Project,
    errors: [
      {
        status: 400,
        description: `Invalid Request`,
        schema: ErrorBody,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: ErrorBody,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: ErrorBody,
      },
    ],
  },
  {
    method: 'patch',
    path: '/projects/:projectId',
    alias: 'update_project',
    description: `Update project details`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: UpdateProjectRequest,
      },
      {
        name: 'projectId',
        type: 'Path',
        schema: z.string().uuid(),
      },
    ],
    response: Project,
    errors: [
      {
        status: 400,
        description: `Invalid Request`,
        schema: ErrorBody,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: ErrorBody,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: ErrorBody,
      },
    ],
  },
  {
    method: 'delete',
    path: '/projects/:projectId',
    alias: 'delete_project',
    description: `Delete a project`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'projectId',
        type: 'Path',
        schema: z.string().uuid(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `Invalid Request`,
        schema: ErrorBody,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: ErrorBody,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: ErrorBody,
      },
    ],
  },
  {
    method: 'get',
    path: '/projects/:projectId/analytics',
    alias: 'get_project_analytics',
    description: `Retrieve project analytics

This API returns analytics for the specified project.
The analytics are returned as time series data in 15 minute intervals, with
the &#x60;time&#x60; field representing the start of the interval.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'projectId',
        type: 'Path',
        schema: z.string().uuid(),
      },
      {
        name: 'since',
        type: 'Query',
        schema: z.string().datetime({ offset: true }),
      },
      {
        name: 'until',
        type: 'Query',
        schema: z.string().datetime({ offset: true }),
      },
    ],
    response: Analytics,
    errors: [
      {
        status: 400,
        description: `Invalid Request`,
        schema: ErrorBody,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: ErrorBody,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: ErrorBody,
      },
    ],
  },
  {
    method: 'get',
    path: '/projects/:projectId/deployments',
    alias: 'list_deployments',
    description: `List deployments of a project

This API returns a list of deployments belonging to the specified project in
a pagenated manner.

The URLs for the next, previous, first, and last page are returned in the
&#x60;Link&#x60; header of the response, if any.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'page',
        type: 'Query',
        schema: z.number().int().gte(1).nullish().default(1),
      },
      {
        name: 'limit',
        type: 'Query',
        schema: z.number().int().gte(1).lte(100).nullish().default(20),
      },
      {
        name: 'q',
        type: 'Query',
        schema: z.string().nullish(),
      },
      {
        name: 'sort',
        type: 'Query',
        schema: z.string().nullish(),
      },
      {
        name: 'order',
        type: 'Query',
        schema: z.string().nullish(),
      },
      {
        name: 'projectId',
        type: 'Path',
        schema: z.string().uuid(),
      },
    ],
    response: z.array(Deployment),
    errors: [
      {
        status: 400,
        description: `Invalid Request`,
        schema: ErrorBody,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: ErrorBody,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: ErrorBody,
      },
    ],
  },
  {
    method: 'post',
    path: '/projects/:projectId/deployments',
    alias: 'create_deployment',
    description: `Create a deployment

This API initiates a build process for a new deployment.

Note that this process is asynchronous; the completion of this API doesn&#x27;t
mean the deployment is ready. In order to keep track of the progress of the
build, call the &quot;Get build logs of a deployment&quot; API or the &quot;Get deployment
details&quot; API.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: CreateDeploymentRequest,
      },
      {
        name: 'projectId',
        type: 'Path',
        schema: z.string().uuid(),
      },
    ],
    response: Deployment,
    errors: [
      {
        status: 400,
        description: `Invalid Request`,
        schema: ErrorBody,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: ErrorBody,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: ErrorBody,
      },
    ],
  },
])

export const api = new Zodios(endpoints)

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options)
}
