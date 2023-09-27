// DOCUMENTED
/**
 * This file contains a SolidityService class that implements the ServiceInterface.
 * The class exposes a create() method that compiles Solidity code using the `solc` package.
 * The file also exports a getOptions() function that returns option parameters for the SolidityService class.
 * @packageDocumentation
 */

import type { Params, ServiceInterface } from '@feathersjs/feathers'
import solc from 'solc'
import { Application } from 'server/core'
import type { Solidity, SolidityData, SolidityQuery } from './solidity.schema'

/**
 * An object representing options for the SolidityService class.
 */
export interface SolidityServiceOptions {
  app: Application
}

/**
 * Alias for the Params type with SolidityQuery type parameters.
 */
type SolidityParams = Params<SolidityQuery>

/**
 * The response object of SolidityService's get() method.
 */
export type SolidityGetResponse = {
  result: any
}

/**
 * The SolidityService class that implements the ServiceInterface.
 * The class compiles Solidity code using the `solc` package.
 */
export class SolidityService<
  ServiceParams extends SolidityParams = SolidityParams
> implements ServiceInterface<Solidity, SolidityData, ServiceParams>
{
  /**
   * Initializes a new instance of the SolidityService class.
   * @param options An object representing the options for SolidityService.
   */
  constructor(public options: SolidityServiceOptions) {}

  /**
   * Compiles Solidity code using the `solc` package and returns the result.
   * @param data An object representing Solidity code.
   * @param params An object representing additional parameters.
   * @returns An object representing the compiled Solidity code.
   */
  async create(data: SolidityData, params?: ServiceParams): Promise<Solidity>

  /**
   * Compiles an array of Solidity code objects using the `solc` package and returns the results.
   * @param data An array of objects representing Solidity code.
   * @param params An object representing additional parameters.
   * @returns An array of objects representing the compiled Solidity code.
   */
  async create(
    data: SolidityData[],
    params?: ServiceParams
  ): Promise<Solidity[]>

  async create(
    data: SolidityData | SolidityData[]
  ): Promise<Solidity | Solidity[] | any> {
    const { code } = data as any

    if (!code) {
      return {
        error: 'The `code` field is required.',
      }
    }

    const input = {
      language: 'Solidity',
      sources: {
        'code.sol': {
          content: code,
        },
      },
      settings: {
        outputSelection: {
          '*': {
            '*': ['*'],
          },
        },
      },
    }

    const output = JSON.parse(solc.compile(JSON.stringify(input)))
    console.log(output)

    return {
      result: output,
    }
  }
}

/**
 * Returns an object representing the options for SolidityService.
 * @param app An Application instance.
 * @returns An object representing the SolidityService options.
 */
export const getOptions = (app: Application): SolidityServiceOptions => {
  return { app }
}
