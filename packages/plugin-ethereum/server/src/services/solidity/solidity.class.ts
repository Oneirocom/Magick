// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { Params, ServiceInterface } from '@feathersjs/feathers'

import solc from 'solc'

import { Application } from '@magickml/server-core'
import type { Solidity, SolidityData, SolidityQuery } from './solidity.schema'

export type { Solidity, SolidityData, SolidityQuery }

export interface SolidityServiceOptions {
  app: Application
}

type SolidityParams = Params<SolidityQuery>

export type SolidityGetResponse = {
  result: any
}

// This is a skeleton for a custom service class. Remove or add the methods you need here
export class SolidityService<ServiceParams extends SolidityParams = SolidityParams>
  implements ServiceInterface<Solidity, SolidityData, ServiceParams>
{
  constructor(public options: SolidityServiceOptions) {}

  async create(data: SolidityData, params?: ServiceParams): Promise<Solidity>
  async create(data: SolidityData[], params?: ServiceParams): Promise<Solidity[]>
  async create(
    data: SolidityData | SolidityData[],
  ): Promise<Solidity | any /* TODO: type me */> {
    const { code } = data as any
    
    if (!code) {
      return {
        error:
          'The `code` field is required.',
      }
    }

    const input = {
      language: 'Solidity',
      sources: {
        'code.sol': {
          content: code
        }
      },
      settings: {
        outputSelection: {
          '*': {
            '*': ['*']
          }
        }
      }
    };
  
    const output = JSON.parse(solc.compile(JSON.stringify(input)));
    console.log(output)

    return {
      result: output,
    }
  }
}

export const getOptions = (app: Application) => {
  return { app }
}
