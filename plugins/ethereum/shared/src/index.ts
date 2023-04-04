// DOCUMENTED 
/**
 * Contains an array of node classes used in blockchain transactions.
 */
import { CallContractFunctionRead } from './nodes/CallContractFunctionRead';
import { CallContractFunctionWrite } from './nodes/CallContractFunctionWrite';
import { CheckForRecentTxFromWallet } from './nodes/CheckForRecentTxFromWallet';
import { CompileContract } from './nodes/CompileContract';
import { DeployContract } from './nodes/DeployContract';
import { GetERC20BalanceFromWallet } from './nodes/GetERC20BalanceFromWallet';
import { GetNativeBalanceFromWallet } from './nodes/GetNativeBalanceFromWallet';
import { GetRecentTxsFromWallet } from './nodes/GetRecentTxsFromWallet';

/**
 * An array containing all node classes used for blockchain transactions.
 */
export default [
  CompileContract,
  DeployContract,
  CheckForRecentTxFromWallet,
  CallContractFunctionWrite,
  CallContractFunctionRead,
  GetRecentTxsFromWallet,
  GetNativeBalanceFromWallet,
  GetERC20BalanceFromWallet,
];