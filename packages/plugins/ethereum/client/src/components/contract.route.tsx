// DOCUMENTED
import { ethers } from 'ethers';
import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  useAccount,
  useConnect,
  useContract,
  useContractWrite,
  useDisconnect,
  useNetwork,
  usePrepareContractWrite,
  useSigner,
  useSwitchNetwork
} from 'wagmi';
import contractABI from './contract.json';

/**
 * ContractComponent to interact with Ethereum contracts
 * @component
 * @param {any} props
 * @returns {React.JSX.Element}
 */
export const ContractComponent: FC<any> = (props) => {
  props = props.props;

  const {
    chain: contractChain,
    address: contractAddress,
    function: contractFunction,
  } = useParams();

  const DEFAULT_RPC = 'https://polygon-mumbai.blockpi.network/v1/rpc/public';

  if (!contractFunction || !contractAddress || !contractChain) return null;

  const contractChainParsed = parseInt(contractChain);

  const [lastTx, setLastTx] = useState('');
  const [functionParam, setFunctionParam] = useState('');
  const [contractFunctions, setContractFunctions] = useState<string[]>();

  const { chain } = useNetwork();

  const { data: signer } = useSigner({
    chainId: contractChainParsed,
  });

  const contract = useContract({
    address: contractAddress,
    abi: contractABI,
    signerOrProvider: signer,
  });

  const { connector, isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const {
    connect,
    connectors,
    error,
    isLoading,
    pendingConnector,
  } = useConnect({
    chainId: contractChainParsed,
  });

  /**
   * Generates a random string of specified length
   * @param {number} length
   * @returns {string}
   */
  const makeid = (length: number): string => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  };

  // Initialize contract functions and function params
  useEffect(() => {
    const newStr = makeid(8);
    setFunctionParam(newStr);
    const cFunctionList: string[] = [];
    for (const functionName in contract?.functions) {
      cFunctionList.push(functionName);
    }
    setContractFunctions(cFunctionList);
  }, []);

  const { config: contractConfig } = usePrepareContractWrite({
    address: `0x${contractAddress.substring(2, contractAddress.length)}`,
    abi: contractABI,
    functionName: contractFunction,
    chainId: contractChainParsed,
    args: [functionParam],
    signer: signer,
    onError(error: any) {
      console.warn(error);
    },
    onSuccess(data) {
      console.log(data);
    },
  });

  /**
   * Calls the selected contract function
   */
  const callContractFun = async () => {
    const res = await contractWrite?.();
    setLastTx(res?.hash as string);
    const called = await res?.wait();
  };

  const {
    data: callData,
    writeAsync: contractWrite,
    isError: isCallError,
    error: callError,
    isSuccess: isCallSuccess,
    status: callStatus,
  } = useContractWrite(contractConfig);

  // TODO: error handling when switching network
  const {
    chains,
    error: errorSwitch,
    isLoading: isLoadingSwitch,
    pendingChainId,
    switchNetwork,
  } = useSwitchNetwork();

  /**
   * Adds custom RPC for Mumbai network
   * @returns {Promise<void>}
   */
  const addCustomRpcHttp = async (): Promise<void> => {
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
      });
    }
    return undefined;
  };

  const isCorrectNetwork = chain?.id === contractChainParsed;

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
            ...
            {rest code is same}
            ...
          </div>
        </div>
        );
};
