import { NodeCategory, makeInNOutFunctionDesc } from '@magickml/behave-graph'
import type Ajv from 'ajv'

export type IValidatorFactory = () => Ajv

export const makeValidate = (validatorFactory: IValidatorFactory) => {
  return makeInNOutFunctionDesc({
    name: 'logic/validate/object',
    category: NodeCategory.Logic,
    label: 'Validate',
    in: [
      {
        schema: 'object',
      },
      {
        data: 'object',
      },
    ],
    out: [
      {
        result: 'boolean',
      },
      {
        errors: 'array',
      },
    ],
    exec: (schema: object, data: object) => {
      const validator = validatorFactory()

      const result = validator.validate(schema, data)

      return {
        result,
        errors: validator.errors || [],
      }
    },
  })
}
