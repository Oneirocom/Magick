import { Solidity } from './nodes/Solidity'
import { GetRecentTransactions } from './nodes/GetRecentTransactions'
import { DeployContract } from './nodes/DeployContract'
import { CheckForRecentTxFromWallet } from './nodes/CheckForRecentTxFromWallet'
import { CheckEthBalance } from './nodes/CheckEthBalance'
import { CheckBalanceForERC20 } from './nodes/CheckBalanceForERC20'
import { CallContractFunctionWrite } from './nodes/CallContractFunctionWrite'
import { CallContractFunctionRead } from './nodes/CallContractFunctionRead'
export default [
  Solidity,
  GetRecentTransactions,
  DeployContract,
  CheckForRecentTxFromWallet,
  CheckEthBalance,
  CheckBalanceForERC20,
  CallContractFunctionWrite,
  CallContractFunctionRead,
]
