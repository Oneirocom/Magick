// DOCUMENTED
/**
 * This module contains types and functions related to application configuration.
 * @packageDocumentation
 */

import {
  Type,
  getValidator,
  defaultAppConfiguration,
} from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import { dataValidator } from './validators'

/**
 * The schema that describes the application configuration object.
 * It is an intersection type between the default App configuration and an object that adds `host`, `port`, and `public` properties.
 * All properties are optional.
 */
const configurationSchema = Type.Intersect([
  defaultAppConfiguration,
  Type.Object({
    host: Type.String({ maxLength: 255 }),
    port: Type.Number({ minimum: 1, maximum: 65535 }),
    public: Type.String({ format: 'uri' }),
  }),
])

/**
 * The static version of the `configurationSchema` type, used as the return type of `getAppConfiguration`.
 */
export type ApplicationConfiguration = Static<typeof configurationSchema>

/**
 * A function that returns a validator that can validate objects against the `configurationSchema`.
 * @returns The validator function.
 */
const configurationValidator = getValidator(configurationSchema, dataValidator)

// Export both the schema and validator
export { configurationSchema, configurationValidator }
