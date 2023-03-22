import React, { FC } from 'react'
import { useState, useEffect } from 'react'
import {
  useContract,
  useConnect,
  useDisconnect,
  useAccount,
  useNetwork,
  useSigner,
  useContractWrite,
  usePrepareContractWrite,
  useSwitchNetwork,
  WagmiConfig,
  configureChains,
  createClient
} from 'wagmi'
import { goerli, mainnet, polygonMumbai } from 'wagmi/chains'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'
import { publicProvider } from 'wagmi/providers/public'
import { useParams } from 'react-router-dom'
import contractABI from './contract.json'
import { ethers } from 'ethers'

export const ContractComponent: FC<any> = (props) => {
  props = props.props

  const {
    chain: contractChain,
    address: contractAddress,
    function: contractFunction,
  } = useParams()

  const DEFAULT_RPC = 'https://polygon-mumbai.blockpi.network/v1/rpc/public'

  if (!contractFunction || !contractAddress || !contractChain) return null

  const contractChainParsed = parseInt(contractChain)

  const [lastTx, setLastTx] = useState('')
  const [functionParam, setFunctionParam] = useState('')
  const [contractFunctions, setContractFunctions] = useState<string[]>()

  const { chain } = useNetwork()

  const { data: signer } = useSigner({
    chainId: contractChainParsed,
  })

  const contract = useContract({
    address: contractAddress,
    abi: contractABI,
    signerOrProvider: signer,
  })

  const { connector, isConnected, address } = useAccount()
  const { disconnect } = useDisconnect()
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect({
      chainId: contractChainParsed,
    })

  const makeid = length => {
    let result = ''
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    let counter = 0
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
      counter += 1
    }
    return result
  }

  useEffect(() => {
    const newStr = makeid(8)
    setFunctionParam(newStr)
    const cFunctionList: string[] = []
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
    const called = await res?.wait()
  }

  const {
    data: callData,
    writeAsync: contractWrite,
    isError: isCallError,
    error: callError,
    isSuccess: isCallSuccess,
    status: callStatus,
  } = useContractWrite(contractConfig)

  // TODO: error handling when switching network
  const {
    chains,
    error: errorSwitch,
    isLoading: isLoadingSwitch,
    pendingChainId,
    switchNetwork,
  } = useSwitchNetwork()

  const addCustomRpcHttp = async () => {
    if (contractChainParsed === 80001) {
      return await window.ethereum?.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainName: 'Mumbai',
            chainId: ethers.utils.hexValue(contractChainParsed),
            rpcUrls: [DEFAULT_RPC],
            nativeCurrency: {
              name: 'MATIC',
              symbol: 'MATIC',
              decimals: 18,
            },
            blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
          },
        ],
      })
    }
    return undefined
  }

  const isCorrectNetwork = chain?.id === contractChainParsed

  return (
    <div style={{ padding: '50px', fontSize: '12px' }}>
      <h2>Contract</h2>
      <div style={{ marginTop: '30px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div>
            <span style={{ fontSize: '14px', fontWeight: 'bold', marginRight: '6px' }}>Network:</span>
            <span>{contractChain}</span>
          </div>
          <div>
            <span style={{ fontSize: '14px', fontWeight: 'bold', marginRight: '6px' }}>Address:</span>
            <span>
              {contractAddress} (
              <a
                href={`https://mumbai.polygonscan.com/address/${contractAddress}`}
                target="_blank"
                rel="noreferrer"
              >
                URL
              </a>)
            </span>
          </div>
          {contractFunctions && (contractFunctions.length > 0) && (
            <>
              <h3>Contract Functions</h3>
              <div>
                <ul style={{ paddingLeft: '12px' }}>
                  {contractFunctions.map((f, i) => {
                    const keyStr = `${i}-${f}`
                    return <li key={keyStr}>- {f}</li>
                  })}
                </ul>
              </div>
            </>
          )}
          <div>
            <span style={{ fontSize: '14px', fontWeight: 'bold', marginRight: '6px' }}>Selected Function:</span>
            <span>{contractFunction}</span>
          </div>
          <div>
            <span style={{ fontSize: '14px', fontWeight: 'bold', marginRight: '6px' }}>Function Param:</span>
            <span>
              {`${functionParam} (${typeof functionParam})`}
            </span>
          </div>
          {isConnected && isCorrectNetwork && (
            <div style={{ marginTop: '12px' }}>
              <button onClick={() => callContractFun()} disabled={!isConnected}>
                Call Function
              </button>
              {isCallSuccess && (
                <p>
                  {`Transaction: ${lastTx}`} (
                  <a
                    href={`https://mumbai.polygonscan.com/tx/${lastTx}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    URL
                  </a>
                  )
                </p>
              )}
              {isCallError && (
                <p style={{ color: 'red' }}>{`Error: ${callError}`}</p>
              )}
            </div>
          )}
        </div>
      </div>
      <hr
        style={{
          marginTop: '40px',
          marginBottom: '40px',
          borderWidth: '0px',
          borderColor: '#383838',
        }}
      />
      <hr
        style={{
          marginTop: '40px',
          marginBottom: '40px',
          borderWidth: '0px',
          borderColor: '#383838',
        }}
      />
      <h2>Web3 Wallet</h2>
      <div style={{ marginTop: '30px' }}>
        {!isConnected && connectors
          .filter(x => x.ready && x.id !== connector?.id)
          .map(x => (
            <div style={{ marginBottom: '8px' }}>
              <button key={x.id} onClick={() => connect({ connector: x })}>
                {`Connect ${x.name}`}
                {isLoading && x.id === pendingConnector?.id && ' (connecting)'}
              </button>
            </div>
          ))}
        {isConnected && isCorrectNetwork && (
          <>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}
            >
              <div>
                <span style={{ fontSize: '14px', fontWeight: 'bold', marginRight: '6px' }}>Network:</span>
                <span>{`${chain?.id} (${chain?.name})`}</span>
              </div>
              <div>
                <span style={{ fontSize: '14px', fontWeight: 'bold', marginRight: '6px' }}>Address:</span>{`${address}`} (
                <span>

                  <a
                    href={`https://mumbai.polygonscan.com/address/${address}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    URL
                  </a>
                  )
                </span>
              </div>
            </div>
          </>
        )}
        {(isConnected && !isCorrectNetwork) && (
          <>
            <span
              style={{ color: 'red'}}
            >{`Your wallet are connected to a wrong network, please change it to ${contractChain} chain`}</span>
            <div style={{ marginTop: '20px' }}>
              <button onClick={() => switchNetwork?.(contractChainParsed)}>
                Change network
              </button>
            </div>
            {/* <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: '12px',
                  gap: '20px',
                }}
              >
                <span style={{ fontSize: '14px', fontWeight: 'bold', marginRight: '6px' }}>RPC Endpoint (HTTP/S):</span>
              </div>
              <div>
                <input
                  style={{ width: '400px' }}
                  value={DEFAULT_RPC}
                  placeholder="Enter RPC Endpoint here"
                ></input>
                <button
                  key="addCustomRpcHttp"
                  onClick={() => addCustomRpcHttp()}
                  disabled={!isConnected}
                  style={{ marginBottom: '12px' }}
                >
                  Add Custom RPC
                </button>
              </div>
            </div> */}
          </>
        )}
        {isConnected && (
          <div>
            <button
              key="disconnect"
              onClick={() => disconnect()}
              disabled={!isConnected}
              style={{ marginTop: '20px' }}
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
