// GENERATED 
/**
 * All necessary modules and imports are listed at the start of the file.
 */
import { configureChains, createClient } from 'wagmi'
import { goerli, mainnet, polygonMumbai } from 'wagmi/chains'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'
import { publicProvider } from 'wagmi/providers/public'

/**
 * The configureChains function sets up the chains to be used for this client.
 * We assume that we will use mainnet and polygonMumbai, and optionally include goerli depending on the current environment mode.
 * We also include some providers for each chain, such as publicProvider for the first chain and two rpc providers for polygonMumbai.
 */
const { chains, provider, webSocketProvider } = configureChains(
  [
    mainnet,
    polygonMumbai,
    ...(import.meta.env?.MODE === 'development' ? [goerli] : []),
  ],
  [
    publicProvider(),
    jsonRpcProvider({
      rpc: chain =>
        chain.id === polygonMumbai.id
          ? { http: 'https://rpc-mumbai.maticvigil.com' }
          : null,
    }),
    jsonRpcProvider({
      rpc: chain =>
        chain.id === polygonMumbai.id
          ? { http: 'https://polygon-mumbai.blockpi.network/v1/rpc/public' }
          : null,
    }),
  ]
)

/**
 * We create a client using the createClient function.
 * We set autoConnect to true, add some connectors such as MetaMaskConnector and CoinbaseWalletConnector, and provide the provider and webSocketProvider we set up through configureChains.
 */
export const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'wagmi',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    }),
  ],
  provider,
  webSocketProvider,
})