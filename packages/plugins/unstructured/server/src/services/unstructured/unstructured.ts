// DOCUMENTED
/**
 * For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
 */

// Import hooks from '@feathersjs/schema'
import { hooks as schemaHooks } from '@feathersjs/schema'

// Import Unstructured resolvers and validators
import {
  unstructuredQueryResolver,
  unstructuredQueryValidator,
} from './unstructured.schema'
import { v4 as uuidv4 } from 'uuid'
import pgvector from 'pgvector/pg'
// Import types and classes
import type { Application, HookContext } from '@magickml/server-core'
import { UnstructuredService, getOptions } from './unstructured.class'
import Koa from 'koa'
import multer from 'koa-multer'

// Array with 1536 elements containing 0
const nullArray = new Array(1536).fill(0)

// Add this service to the service type index
declare module '@magickml/server-core' {
  interface ServiceTypes {
    [unstructuredPath]: UnstructuredService
  }
}

// Constants for Unstructured path and methods
export const unstructuredPath = 'unstructured'
export const unstructuredMethods = ['create'] as const

// Export class and schema files
export * from './unstructured.class'
export * from './unstructured.schema'

/**
 * A configure function that registers the service and its hooks via `app.configure`
 * @param app - The Feathers application
 */
export const unstructured = (app: Application) => {
  // Register our service on the Feathers application
  app.use(unstructuredPath, new UnstructuredService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: unstructuredMethods,
    // You can add additional custom events to be sent to clients here
    events: [],
  })

  const upload = multer()
  app.use(unstructuredPath, upload.single('files'))

  // Initialize hooks
  app.service(unstructuredPath).hooks({
    around: {
      all: [],
    },
    before: {
      all: [],
      create: [],
    },
    after: {
      all: [],
    },
    error: {
      all: [],
    },
  } as any) // TODO: fix me
}
