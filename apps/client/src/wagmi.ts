import { configureChains, createClient } from 'wagmi'
import { goerli, mainnet, polygonMumbai } from 'wagmi/chains'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'
import { publicProvider } from 'wagmi/providers/public'

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, polygonMumbai, ...(import.meta.env?.MODE === 'development' ? [goerli] : [])],
  [
    publicProvider(),
    jsonRpcProvider({ rpc: (chain) => (chain.id === polygonMumbai.id ? { http: 'https://rpc-mumbai.maticvigil.com', } : null), }),
    jsonRpcProvider({ rpc: (chain) => (chain.id === polygonMumbai.id ? { http: 'https://polygon-mumbai.blockpi.network/v1/rpc/public', } : null), }),
    alchemyProvider({ apiKey: import.meta.env.VITE_APP_ETH_PROVIDER_ALCHEMY_KEY_MUMBAI as string })
  ],
)

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
