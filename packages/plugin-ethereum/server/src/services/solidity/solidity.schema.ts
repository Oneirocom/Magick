// DOCUMENTED 
/**
 * The Solidity interface represents the main data model schema.
 * @interface
 */
export interface Solidity {
  /** The id of the solidity code. */
  id: string
  /** The solidity code itself. */
  code: string
}

/**
 * soliditySchema defines the main data model schema using Typebox.
 * @const
 *
 * @type {import('@feathersjs/typebox').IBrand<Type.Object<Type.String, Type.String & import('@feathersjs/typebox').ITagged<Type.Object<Type.String>>>> & { $id: string; additionalProperties: false }}
 */
export const soliditySchema = Type.Object(
  {
    id: Type.String(),
    code: Type.String(),
  },
  { $id: 'Solidity', additionalProperties: false }
)

/**
 * getValidator returns a data validator from a schema.
 * @param {import('@feathersjs/typebox').IBrand<Type.Object>} schema - The schema used to validate.
 * @func
 * @return {*}  {import('ajv').ValidateFunction}
 */
export function getValidator<T extends Type.Object>(
  schema: T
): import('ajv').ValidateFunction {
  return dataValidator.compile(schema)
}

/**
 * resolve returns a schema resolver for the given schema.
 * @template T
 * @param {import('@feathersjs/typebox').IBrand<Type.Object>} schema - The schema used to resolve.
 * @param {*} context
 * @func
 * @return {*} 
 */
export function resolve<T extends Type.Object>(
  schema: T,
  context: any
): any {
  return dataValidator.resolve(schema, context)
}

/**
 * solidityValidator validates the soliditySchema.
 *
 * @type {import('ajv').ValidateFunction}
 */
export const solidityValidator = getValidator(soliditySchema)

/**
 * solidityResolver resolves the soliditySchema.
 *
 * @type {*}
 */
export const solidityResolver = resolve<Solidity>(soliditySchema, {})

// Schema for creating new entries
/**
 * solidityDataSchema defines a schema for creating new Solidity entries.
 *
 * @const
 * @type {*}
 */
export const solidityDataSchema = Type.Pick(soliditySchema, [
  'id',
  'code',
], {
  $id: 'SolidityData'
})

/**
 * SolidityData represents the schema when creating new entries.
 *
 * @type {*}
 */
export type SolidityData = Static<typeof solidityDataSchema>

/**
 * solidityDataValidator validates the SolidityData schema.
 *
 * @type {import('ajv').ValidateFunction}
 */
export const solidityDataValidator = getValidator(solidityDataSchema)

/**
 * solidityDataResolver resolves the SolidityData schema.
 *
 * @type {*}
 */
export const solidityDataResolver = resolve<SolidityData, HookContext>({})

// Schema for allowed query properties
/**
 * solidityQueryProperties is a schema that defines the allowed query properties.
 *
 * @const
 * @type {*}
 */
export const solidityQueryProperties = Type.Pick(soliditySchema, [
  'id',
  'code',
])

/**
 * solidityQuerySchema is the schema for the allowed queries on Solidity.
 *
 * @const
 * @type {*}
 */
export const solidityQuerySchema = Type.Intersect(
  [
    querySyntax(solidityQueryProperties),
    Type.Object({
      'id': Type.Optional(Type.String()),
      'code': Type.String(),
    }, { additionalProperties: false })
  ],
  { additionalProperties: false }
)

/**
 * SolidityQuery represents the schema for allowed queries on Solidity.
 *
 * @type {*}
 */
export type SolidityQuery = Static<typeof solidityQuerySchema>

/**
 * solidityQueryValidator validates the SolidityQuery schema.
 *
 * @type {import('ajv').ValidateFunction}
 */
export const solidityQueryValidator = getValidator(solidityQuerySchema)

/**
 * solidityQueryResolver resolves the SolidityQuery schema.
 *
 * @type {*}
 */
export const solidityQueryResolver = resolve<SolidityQuery, HookContext>({})
