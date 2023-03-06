<<<<<<< refs/remotes/origin/development
import { Solidity } from './nodes/Solidity'
import { GetRecentTransactions } from './nodes/GetRecentTransactions'
import { DeployContract } from './nodes/DeployContract'
import { CheckForRecentTxFromWallet } from './nodes/CheckForRecentTxFromWallet'
import { CheckEthBalance } from './nodes/CheckEthBalance'
import { CheckBalanceForERC20 } from './nodes/CheckBalanceForERC20'
import { CallContractFunctionWrite } from './nodes/CallContractFunctionWrite'
=======
>>>>>>> plugin(eth): change node's names and display names
import { CallContractFunctionRead } from './nodes/CallContractFunctionRead'
import { CallContractFunctionWrite } from './nodes/CallContractFunctionWrite'
import { CompileContract } from './nodes/CompileContract'
import { DeployContract } from './nodes/DeployContract'
import { GetERC20BalanceFromWallet } from './nodes/GetERC20BalanceFromWallet'
import { GetNativeBalanceFromWallet } from './nodes/GetNativeBalanceFromWallet'
import { GetRecentTxsFromWallet } from './nodes/GetRecentTxsFromWallet'
export default [
  CompileContract,
  DeployContract,
<<<<<<< refs/remotes/origin/development
  CheckForRecentTxFromWallet,
  CheckEthBalance,
  CheckBalanceForERC20,
  CallContractFunctionWrite,
=======
>>>>>>> plugin(eth): change node's names and display names
  CallContractFunctionRead,
  CallContractFunctionWrite,
  GetRecentTxsFromWallet,
  GetNativeBalanceFromWallet,
  GetERC20BalanceFromWallet,
]
