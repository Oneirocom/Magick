import { Solidity } from './nodes/Solidity'
import { GetRecentTransactions } from './nodes/GetRecentTransactions'
import { DeployContract } from './nodes/DeployContract'
import { CheckForRecentTransactionsFromWallet } from './nodes/CheckForRecentTransactionsFromWallet'
import { CheckEthBalance } from './nodes/CheckEthBalance'
import { CheckBalanceForERC20 } from './nodes/CheckBalanceForERC20'
import { CallContractFunctionWrite } from './nodes/CallContractFunctionWrite'
import { CallContractFunctionRead } from './nodes/CallContractFunctionRead'
export default [
  Solidity,
  GetRecentTransactions,
  DeployContract,
  CheckForRecentTransactionsFromWallet,
  CheckEthBalance,
  CheckBalanceForERC20,
  CallContractFunctionWrite,
  CallContractFunctionRead,
]
