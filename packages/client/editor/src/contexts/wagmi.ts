// DOCUMENTED
/**
 * All necessary modules and imports are listed at the start of the file.
 */
import { createPublicClient, http } from 'viem'
import { createConfig } from 'wagmi'
import { mainnet } from 'wagmi/chains'

export const config = createConfig({
  autoConnect: true,
  publicClient: createPublicClient({
    chain: mainnet,
    transport: http(),
  }),
})
