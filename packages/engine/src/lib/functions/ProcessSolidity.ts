import { loadPyodide } from "pyodide";
import solc from 'solc';

const isBrowser = typeof window !== "undefined";

export default async function compileSolidity(code, entry, data) {
  if (isBrowser) {
    console.log('ops its browser')
    return {
      bytecode: '0x',
      abi: []
    }
  } else {
    const input = {
      language: 'Solidity',
      sources: {
        'solidity.sol': {
          content: code
        }
      },
      settings: {
        optimizer: {
          enabled: data.optimization,
          runs: data.optimization_num
        },
        outputSelection: {
          '*': {
            '*': ['*']
          }
        }
      }
    };
    // TODO: change hardcoded contract name to a dynamic compilation
    // const output = JSON.parse(solc.compile(JSON.stringify(input)));
    // const bytecode = output.contracts['solidity.sol']['SimpleContract'].evm.bytecode.object
    // const abi = output.contracts['solidity.sol']['SimpleContract'].abi
    const bytecode = '0x'
    const abi = []
    return {
      bytecode: bytecode,
      abi: abi,
    };
  }
};
