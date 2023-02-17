import React from 'react'
import { useState, useEffect } from 'react'
import { useContract, useConnect, useDisconnect, useAccount, useNetwork, useSigner, useContractWrite, usePrepareContractWrite, useSwitchNetwork } from 'wagmi'
import { useParams } from 'react-router-dom'
import contractABI from './contract.json'
import { ethers } from "ethers"

const Contract = () => {
  const { chain: contractChain, address: contractAddress, function: contractFunction } = useParams()

  const DEFAULT_RPC = 'https://polygon-mumbai.blockpi.network/v1/rpc/public'

  if (
    !contractFunction ||
    !contractAddress ||
    !contractChain
  )
    return

  const contractChainParsed = parseInt(contractChain)

  const { data: signer } = useSigner({
    chainId: contractChainParsed
  })

  const [lastTx, setLastTx] = useState("");
  const [functionParam, setFunctionParam] = useState("");
  const [contractFunctions, setContractFunctions] = useState<string[]>();

  const { chain } = useNetwork()

  useEffect(() => {
    if (!contractAddress) return
    console.log(contractAddress)
  }, [contractAddress])

  const { connector, isConnected, address } = useAccount()
  const { disconnect } = useDisconnect()
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect({
    chainId: contractChainParsed
  })

  // TODO: make support for any evm networks
  // TODO: remove hardcoded ABI json
  // TODO: dynamic get ABI:
  //   - fetch ABI online if available, if not don't let people use contract?
  // TODO: map the available ABI and the requested function (name and params), higlight the interaction
  const contract = useContract({
    address: contractAddress,
    abi: contractABI,
    signerOrProvider: signer,
  })

  const makeid = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  useEffect(() => {
    const newStr = makeid(8)
    setFunctionParam(newStr)
    let cFunctionList: string[] = []
    for (const functionName in contract?.functions) {
      cFunctionList.push(functionName)
    }
    setContractFunctions(cFunctionList)
  }, [])

  const { config: contractConfig } = usePrepareContractWrite({
    address: `0x${contractAddress.substring(2, contractAddress.length)}`,
    abi: contractABI,
    functionName: contractFunction,
    chainId: contractChainParsed,
    args: [functionParam],
    signer: signer,
    onError(error: any) {
      console.warn(error)
    },
    onSuccess(data) {
      console.log(data)
    },
  })

  const callContractFun = async () => {
    const res = await contractWrite?.()
    setLastTx(res?.hash as string)
    console.log(res?.hash)
    const called = await res?.wait()
    console.log(called)
  }

  const { data: callData, writeAsync: contractWrite, isError: isCallError, error: callError, isSuccess: isCallSuccess, status: callStatus } = useContractWrite(contractConfig)

  // TODO: error handling when switching network
  const { chains, error: errorSwitch, isLoading: isLoadingSwitch, pendingChainId, switchNetwork } = useSwitchNetwork()

  const addCustomRpcHttp = async () => {
    if (contractChainParsed === 80001) {
      return await window.ethereum?.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainName: "Mumbai",
            chainId: ethers.utils.hexValue(contractChainParsed),
            rpcUrls: [DEFAULT_RPC],
            nativeCurrency: {
              name: 'MATIC',
              symbol: 'MATIC',
              decimals: 18
            },
            blockExplorerUrls: ['https://mumbai.polygonscan.com/']
          },
        ],
      });
    }
    return undefined;
  }

  const isCorrectNetwork = chain?.id === contractChainParsed
  // const t = JSON.stringify(contractABI, null, 2)

  return (
    <div style={{ padding: '50px' }}>
      <h2>Web3 Wallet</h2>
      {!isConnected && connectors
        .filter((x) => x.ready && x.id !== connector?.id)
        .map((x) => (
          <button key={x.id} onClick={() => connect({ connector: x })}>
            {`Connect ${x.name}`}
            {isLoading && x.id === pendingConnector?.id && ' (connecting)'}
          </button>
        ))}
      {isConnected && (
        <>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <span>{`Network: ${chain?.id} (${chain?.name})`}</span>
            {!isCorrectNetwork && (<span style={{ marginLeft: '6px', color: 'red' }}>{`Wrong network (please change network or add a custom for ${contractChain} chain)`}</span>)}
          </div>
          <p>{`Address: ${address}`} (<a href={`https://mumbai.polygonscan.com/address/${address}`} target="_blank">URL</a>)</p>
        </>
      )}
      {(isConnected && !isCorrectNetwork) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '12px', gap: '20px' }}>
            <span>RPC Endpoint (HTTP/S):</span>
            <input style={{ width: '400px' }} value={DEFAULT_RPC}></input>
            <button key="addCustomRpcHttp" onClick={() => addCustomRpcHttp()} disabled={!isConnected} style={{ marginBottom: '12px' }}>Add Custom RPC</button>
          </div>
          <div>
            <button onClick={() => switchNetwork?.(contractChainParsed)}>Change network</button>
          </div>
        </div>
      )}
      {isConnected && (
        <div>
          <button key="disconnect" onClick={() => disconnect()} disabled={!isConnected} style={{ marginTop: '20px' }}>Disconnect</button>
        </div>
      )}
      <hr style={{ marginTop: '40px', marginBottom: '40px', borderWidth: '1px', borderColor: '#383838' }} />
      <h2>Contract Information</h2>
      <p>{`Network: ${contractChain}`}</p>
      <p>{`Address: ${contractAddress}`} (<a href={`https://mumbai.polygonscan.com/address/${contractAddress}`} target="_blank">URL</a>)</p>
      <h3>Contract Execution</h3>
      <p>{`Function Name: ${contractFunction}`}</p>
      <p>{`Function Param: ${functionParam} (${typeof (functionParam)})`}</p>
      {(isConnected && isCorrectNetwork) && (
        <>
          {isCallSuccess && (
            <p>{`Transaction: ${lastTx}`} (<a href={`https://mumbai.polygonscan.com/tx/${lastTx}`} target="_blank">URL</a>)</p>
          )}
          <button onClick={() => callContractFun()} disabled={!isConnected}>Call</button>
          {isCallError && (<p style={{color: 'red'}}>{`Error: ${callError}`}</p>)}
          <h3>Contract Functions</h3>
          <div>
            <ul>
              {contractFunctions && contractFunctions.map((f, i) => {
                const keyStr = `${i}-${f}`
                return (
                  <li key={keyStr}>- {f}</li>
                )
              })}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}

export default Contract
