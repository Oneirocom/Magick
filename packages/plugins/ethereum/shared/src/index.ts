// DOCUMENTED
import { Solidity } from './nodes/Solidity';
import { ContractCallFunRead } from './nodes/ContractCallFunRead';
import { ContractCallFunWrite } from './nodes/ContractCallFunWrite';
import { ContractDeploy } from './nodes/ContractDeploy';
import { GetERC20TokenBalance } from './nodes/GetERC20TokenBalance';
import { GetNativeTokenBalance } from './nodes/GetNativeTokenBalance';
// import { SearchTransactions } from './nodes/SearchTransactions';
// import { GetTransactions } from './nodes/GetTransactions';
import { MagickComponent } from '@magickml/core';

/**
 * Get a list of MagickComponents related to blockchain transactions.
 * @returns {MagickComponent<unknown>[]} An array of MagickComponents.
 */
export function getNodes(): MagickComponent<any>[] {
  return [
    Solidity as any,
    ContractCallFunRead as any,
    ContractCallFunWrite as any,
    ContractDeploy as any,
    GetERC20TokenBalance as any,
    GetNativeTokenBalance as any,
    // SearchTransactions as any,
    // GetTransactions as any,
  ];
}

/**
 * A mapping of chain IDs to native network data.
 * @type {{ [chainId: number]: { name: string, chainId: number, defaultRpcs: { rpcHttp: string[] } } }}
 */
export const nativeNetworks: {
  [chainId: number]: {
    name: string,
    chainId: number,
    defaultRpcs: { rpcHttp: string[] },
    explorer: { name: string, url: string, urlApi: string},
  },
} = {
  1: {
    name: 'mainnet',
    chainId: 1,
    defaultRpcs: {
      rpcHttp: [
        'https://rpc.ankr.com/eth',
        'https://rpc.flashbots.net/',
        'https://cloudflare-eth.com',
      ],
    },
    explorer: {
      name: 'EtherScan',
      url: 'https://etherscan.io/',
      urlApi: 'https://api.etherscan.io/api',
    }
  },
  10: {
    name: 'optimism',
    chainId: 10,
    defaultRpcs: {
      rpcHttp: ['https://rpc.ankr.com/optimism'],
    },
    explorer: {
      name: 'Optimistic EtherScan',
      url: 'https://optimistic.etherscan.io/',
      urlApi: 'https://api-optimistic.etherscan.io/api',
    }
  },
  137: {
    name: 'polygon',
    chainId: 137,
    defaultRpcs: {
      rpcHttp: ['https://rpc.ankr.com/polygon'],
    },
    explorer: {
      name: 'PolygonScan',
      url: 'https://polygonscan.com/',
      urlApi: 'https://api.polygonscan.com/api',
    }
  },
  80001: {
    name: 'matic-mumbai',
    chainId: 80001,
    defaultRpcs: {
      rpcHttp: ['https://rpc.ankr.com/polygon_mumbai'],
    },
    explorer: {
      name: 'Mumbai PolygonScan',
      url: 'https://mumbai.polygonscan.com/',
      urlApi: 'https://api-testnet.polygonscan.com/api',
    }
  },
};

/**
 * An array containing all MagickComponent classes related to blockchain transactions.
 * @type {MagickComponent<unknown>[]}
 */
export default [
  Solidity,
  ContractCallFunRead,
  ContractCallFunWrite,
  ContractDeploy,
  GetERC20TokenBalance,
  GetNativeTokenBalance,
  // SearchTransactions,
  // GetTransactions,
];
