// DOCUMENTED
import type { Params, ServiceInterface } from '@feathersjs/feathers';
import { Application } from '@magickml/server-core';
import type { Solidity, SolidityData, SolidityQuery } from './solidity.schema';
import solc from 'solc';

/**
 * Interface for SolidityService options.
 */
export interface SolidityServiceOptions {
  app: Application;
}

/**
 * Type definition for SolidityParams.
 */
type SolidityParams = Params<SolidityQuery>;

/**
 * The SolidityService class implements the ServiceInterface.
 * It provides functionality for compiling Solidity code.
 */
export class SolidityService<ServiceParams extends SolidityParams = SolidityParams>
  implements ServiceInterface<Solidity, SolidityData, ServiceParams> {
  /**
   * Constructor for the SolidityService class.
   * @param options - SolidityServiceOptions object.
   */
  constructor(public options: SolidityServiceOptions) {}

  /**
   * Creates and compiles the Solidity code.
   * @param data - SolidityData object containing the code to be compiled.
   * @returns Promise resolving to the compiled Solidity output.
   */
  async create(
    data: SolidityData,
  ): Promise<Solidity | any > {
    const { code, optimizer, optimizerRuns } = data as any;

    const settings: {optimizer?: object} = {}
    const optimizationSettings: {enabled?: boolean, runs?: number} = {}
    if (typeof optimizer !== 'undefined'){
      optimizationSettings.enabled = optimizer
      optimizationSettings.runs = optimizerRuns
      settings.optimizer = optimizationSettings
    }

    if (!code) {
      return {
        error: 'The `code` field is required.'
      };
    }

    const input = {
      language: 'Solidity',
      sources: {
        'code.sol': {
          content: code
        }
      },
      settings: {
        ...settings,
        outputSelection: {
          '*': {
            '*': ['*']
          }
        }
      }
    };

    const output = JSON.parse(solc.compile(JSON.stringify(input)));

    return {
      result: output
    };
  }
}

/**
 * Returns the options object for SolidityService.
 * @param app - Application object.
 * @returns SolidityServiceOptions object.
 */
export const getOptions = (app: Application): SolidityServiceOptions => {
  return { app };
}
