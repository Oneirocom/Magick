// const PineconeDb = require('@llm-tools/embedjs/vectorDb/pinecone').PineconeDb

// @ts-ignore
import { PineconeDb } from '@llm-tools/embedjs/vectorDb/pinecone'

interface UsePineconeDbProps {
  entity: string
  packId: string
}

export function usePineconeDb({ entity, packId }: UsePineconeDbProps) {
  return new PineconeDb({
    projectName: process.env['EMBEDDER_PINECONE_PROJECT'] || 'embedder',
    namespace: `${entity}/${packId}`,
    indexSpec: {
      serverless: {
        cloud: 'aws',
        region: 'us-east-1',
      },
    },
  })
}
