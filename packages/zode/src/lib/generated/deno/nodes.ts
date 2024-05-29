import { z } from 'zod'
import { NodeCategory } from '@magickml/behave-graph'
import {
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
} from './schema'

const nodes = [
  {
    typeName: '/patch_/databases/:databaseid',
    category: NodeCategory.Action,
    label: 'patch /databases/:databaseId',
    in: {
      flow: 'flow',
      body: {
        valueType: 'string',
        defaultValue: '',
      },
      databaseId: {
        valueType: 'string',
        defaultValue: '',
      },
    },
    configuration: [],
  },
  {
    typeName: '/get_/deployments/:deploymentid',
    category: NodeCategory.Action,
    label: 'get /deployments/:deploymentId',
    in: {
      flow: 'flow',

      deploymentId: {
        valueType: 'string',
        defaultValue: '',
      },
    },
    configuration: [],
  },
  {
    typeName: '/delete_/deployments/:deploymentid',
    category: NodeCategory.Action,
    label: 'delete /deployments/:deploymentId',
    in: {
      flow: 'flow',

      deploymentId: {
        valueType: 'string',
        defaultValue: '',
      },
    },
    configuration: [],
  },
  {
    typeName: '/get_/deployments/:deploymentid/appLogs',
    category: NodeCategory.Action,
    label: 'get /deployments/:deploymentId/app_logs',
    in: {
      flow: 'flow',

      q: {
        valueType: 'string',
        defaultValue: '',
      },
      level: {
        valueType: 'string',
        defaultValue: '',
      },
      region: {
        valueType: 'string',
        defaultValue: '',
      },
      since: {
        valueType: 'string',
        defaultValue: '',
      },
      until: {
        valueType: 'string',
        defaultValue: '',
      },
      limit: {
        valueType: 'string',
        defaultValue: '',
      },
      sort: {
        valueType: 'string',
        defaultValue: '',
      },
      order: {
        valueType: 'string',
        defaultValue: '',
      },
      cursor: {
        valueType: 'string',
        defaultValue: '',
      },
      deploymentId: {
        valueType: 'string',
        defaultValue: '',
      },
    },
    configuration: [],
  },
  {
    typeName: '/get_/deployments/:deploymentid/buildLogs',
    category: NodeCategory.Action,
    label: 'get /deployments/:deploymentId/build_logs',
    in: {
      flow: 'flow',

      deploymentId: {
        valueType: 'string',
        defaultValue: '',
      },
    },
    configuration: [],
  },
  {
    typeName: '/post_/deployments/:deploymentid/redeploy',
    category: NodeCategory.Action,
    label: 'post /deployments/:deploymentId/redeploy',
    in: {
      flow: 'flow',

      body: {
        valueType: 'string',
        defaultValue: '',
      },
      deploymentId: {
        valueType: 'string',
        defaultValue: '',
      },
    },
    configuration: [],
  },
  {
    typeName: '/get_/domains/:domainid',
    category: NodeCategory.Action,
    label: 'get /domains/:domainId',
    in: {
      flow: 'flow',

      domainId: {
        valueType: 'string',
        defaultValue: '',
      },
    },
    configuration: [],
  },
  {
    typeName: '/patch_/domains/:domainid',
    category: NodeCategory.Action,
    label: 'patch /domains/:domainId',
    in: {
      flow: 'flow',

      body: {
        valueType: 'string',
        defaultValue: '',
      },
      domainId: {
        valueType: 'string',
        defaultValue: '',
      },
    },
    configuration: [],
  },
  {
    typeName: '/delete_/domains/:domainid',
    category: NodeCategory.Action,
    label: 'delete /domains/:domainId',
    in: {
      flow: 'flow',

      domainId: {
        valueType: 'string',
        defaultValue: '',
      },
    },
    configuration: [],
  },
  {
    typeName: '/post_/domains/:domainid/certificates',
    category: NodeCategory.Action,
    label: 'post /domains/:domainId/certificates',
    in: {
      flow: 'flow',

      body: {
        valueType: 'string',
        defaultValue: '',
      },
      domainId: {
        valueType: 'string',
        defaultValue: '',
      },
    },
    configuration: [],
  },
  {
    typeName: '/post_/domains/:domainid/certificates/provision',
    category: NodeCategory.Action,
    label: 'post /domains/:domainId/certificates/provision',
    in: {
      flow: 'flow',

      domainId: {
        valueType: 'string',
        defaultValue: '',
      },
    },
    configuration: [],
  },
  {
    typeName: '/post_/domains/:domainid/verify',
    category: NodeCategory.Action,
    label: 'post /domains/:domainId/verify',
    in: {
      flow: 'flow',

      domainId: {
        valueType: 'string',
        defaultValue: '',
      },
    },
    configuration: [],
  },
  {
    typeName: '/get_/organizations/:organizationid',
    category: NodeCategory.Action,
    label: 'get /organizations/:organizationId',
    in: {
      flow: 'flow',

      organizationId: {
        valueType: 'string',
        defaultValue: '',
      },
    },
    configuration: [],
  },
  {
    typeName: '/get_/organizations/:organizationid/analytics',
    category: NodeCategory.Action,
    label: 'get /organizations/:organizationId/analytics',
    in: {
      flow: 'flow',

      organizationId: {
        valueType: 'string',
        defaultValue: '',
      },
      since: {
        valueType: 'string',
        defaultValue: '',
      },
      until: {
        valueType: 'string',
        defaultValue: '',
      },
    },
    configuration: [],
  },
  {
    typeName: '/get_/organizations/:organizationid/databases',
    category: NodeCategory.Action,
    label: 'get /organizations/:organizationId/databases',
    in: {
      flow: 'flow',

      page: {
        valueType: 'string',
        defaultValue: '',
      },
      limit: {
        valueType: 'string',
        defaultValue: '',
      },
      q: {
        valueType: 'string',
        defaultValue: '',
      },
      sort: {
        valueType: 'string',
        defaultValue: '',
      },
      order: {
        valueType: 'string',
        defaultValue: '',
      },
      organizationId: {
        valueType: 'string',
        defaultValue: '',
      },
    },
    configuration: [],
  },
  {
    typeName: '/post_/organizations/:organizationid/databases',
    category: NodeCategory.Action,
    label: 'post /organizations/:organizationId/databases',
    in: {
      flow: 'flow',

      body: {
        valueType: 'string',
        defaultValue: '',
      },
      organizationId: {
        valueType: 'string',
        defaultValue: '',
      },
    },
    configuration: [],
  },
  {
    typeName: '/get_/organizations/:organizationid/domains',
    category: NodeCategory.Action,
    label: 'get /organizations/:organizationId/domains',
    in: {
      flow: 'flow',

      page: {
        valueType: 'string',
        defaultValue: '',
      },
      limit: {
        valueType: 'string',
        defaultValue: '',
      },
      q: {
        valueType: 'string',
        defaultValue: '',
      },
      sort: {
        valueType: 'string',
        defaultValue: '',
      },
      order: {
        valueType: 'string',
        defaultValue: '',
      },
      organizationId: {
        valueType: 'string',
        defaultValue: '',
      },
    },
    configuration: [],
  },
  {
    typeName: '/post_/organizations/:organizationid/domains',
    category: NodeCategory.Action,
    label: 'post /organizations/:organizationId/domains',
    in: {
      flow: 'flow',

      body: {
        valueType: 'string',
        defaultValue: '',
      },
      organizationId: {
        valueType: 'string',
        defaultValue: '',
      },
    },
    configuration: [],
  },
  {
    typeName: '/get_/organizations/:organizationid/projects',
    category: NodeCategory.Action,
    label: 'get /organizations/:organizationId/projects',
    in: {
      flow: 'flow',

      page: {
        valueType: 'string',
        defaultValue: '',
      },
      limit: {
        valueType: 'string',
        defaultValue: '',
      },
      q: {
        valueType: 'string',
        defaultValue: '',
      },
      sort: {
        valueType: 'string',
        defaultValue: '',
      },
      order: {
        valueType: 'string',
        defaultValue: '',
      },
      organizationId: {
        valueType: 'string',
        defaultValue: '',
      },
    },
    configuration: [],
  },
  {
    typeName: '/post_/organizations/:organizationid/projects',
    category: NodeCategory.Action,
    label: 'post /organizations/:organizationId/projects',
    in: {
      flow: 'flow',

      body: {
        valueType: 'string',
        defaultValue: '',
      },
      organizationId: {
        valueType: 'string',
        defaultValue: '',
      },
    },
    configuration: [],
  },
  {
    typeName: '/get_/projects/:projectid',
    category: NodeCategory.Action,
    label: 'get /projects/:projectId',
    in: {
      flow: 'flow',

      projectId: {
        valueType: 'string',
        defaultValue: '',
      },
    },
    configuration: [],
  },
  {
    typeName: '/patch_/projects/:projectid',
    category: NodeCategory.Action,
    label: 'patch /projects/:projectId',
    in: {
      flow: 'flow',

      body: {
        valueType: 'string',
        defaultValue: '',
      },
      projectId: {
        valueType: 'string',
        defaultValue: '',
      },
    },
    configuration: [],
  },
  {
    typeName: '/delete_/projects/:projectid',
    category: NodeCategory.Action,
    label: 'delete /projects/:projectId',
    in: {
      flow: 'flow',

      projectId: {
        valueType: 'string',
        defaultValue: '',
      },
    },
    configuration: [],
  },
  {
    typeName: '/get_/projects/:projectid/analytics',
    category: NodeCategory.Action,
    label: 'get /projects/:projectId/analytics',
    in: {
      flow: 'flow',

      projectId: {
        valueType: 'string',
        defaultValue: '',
      },
      since: {
        valueType: 'string',
        defaultValue: '',
      },
      until: {
        valueType: 'string',
        defaultValue: '',
      },
    },
    configuration: [],
  },
  {
    typeName: '/get_/projects/:projectid/deployments',
    category: NodeCategory.Action,
    label: 'get /projects/:projectId/deployments',
    in: {
      flow: 'flow',

      page: {
        valueType: 'string',
        defaultValue: '',
      },
      limit: {
        valueType: 'string',
        defaultValue: '',
      },
      q: {
        valueType: 'string',
        defaultValue: '',
      },
      sort: {
        valueType: 'string',
        defaultValue: '',
      },
      order: {
        valueType: 'string',
        defaultValue: '',
      },
      projectId: {
        valueType: 'string',
        defaultValue: '',
      },
    },
    configuration: [],
  },
  {
    typeName: '/post_/projects/:projectid/deployments',
    category: NodeCategory.Action,
    label: 'post /projects/:projectId/deployments',
    in: {
      flow: 'flow',

      body: {
        valueType: 'string',
        defaultValue: '',
      },
      projectId: {
        valueType: 'string',
        defaultValue: '',
      },
    },
    configuration: [],
  },
]
