// DOCUMENTED
import { resolve } from "@feathersjs/schema";
import { Type, getValidator, querySyntax } from "@feathersjs/typebox";
import type { Static } from "@feathersjs/typebox";
import type { HookContext } from "@magickml/server-core";
import { dataValidator, queryValidator } from "@magickml/server-core";

/**
 * Solidity schema definition.
 */
export const soliditySchema = Type.Object(
  {
    id: Type.String(),
    code: Type.String(),
  },
  { $id: "Solidity", additionalProperties: false }
);

/**
 * Solidity type.
 */
export type Solidity = Static<typeof soliditySchema>;

/**
 * Solidity data validator.
 */
export const solidityValidator = getValidator(soliditySchema, dataValidator);

/**
 * Solidity resolver.
 */
export const solidityResolver = resolve<Solidity, HookContext>({});

/**
 * Solidity external resolver.
 */
export const solidityExternalResolver = resolve<Solidity, HookContext>({});

/**
 * Solidity data schema definition.
 */
export const solidityDataSchema = Type.Pick(soliditySchema, ["id", "code"], {
  $id: "SolidityData",
});

/**
 * Solidity data type.
 */
export type SolidityData = Static<typeof solidityDataSchema>;

/**
 * Solidity data validator.
 */
export const solidityDataValidator = getValidator(
  solidityDataSchema,
  dataValidator
);

/**
 * Solidity data resolver.
 */
export const solidityDataResolver = resolve<SolidityData, HookContext>({});

/**
 * Solidity query properties definition.
 */
export const solidityQueryProperties = Type.Pick(soliditySchema, ["id", "code"]);

/**
 * Solidity query schema definition.
 */
export const solidityQuerySchema = Type.Intersect(
  [
    querySyntax(solidityQueryProperties),
    Type.Object(
      {
        id: Type.Optional(Type.String()),
        code: Type.String(),
      },
      { additionalProperties: false }
    ),
  ],
  { additionalProperties: false }
);

/**
 * Solidity query type.
 */
export type SolidityQuery = Static<typeof solidityQuerySchema>;

/**
 * Solidity query validator.
 */
export const solidityQueryValidator = getValidator(
  solidityQuerySchema,
  queryValidator
);

/**
 * Solidity query resolver.
 */
export const solidityQueryResolver = resolve<SolidityQuery, HookContext>({});
