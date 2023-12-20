import type { INode } from '@magickml/behave-graph'

async function hash(string) {
  const utf8 = new TextEncoder().encode(string)
  const hashBuffer = await crypto.subtle.digest('SHA-256', utf8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray
    .map(bytes => bytes.toString(16).padStart(2, '0'))
    .join('')
  return hashHex
}

type HashProperties = {
  nodeType: string
  positionX: number
  positionY: number
}

export function formatBehaveNodeForHash(node: INode): HashProperties {
  return {
    nodeType: node.nodeType,
    positionX: node.metadata?.positionX ?? 0,
    positionY: node.metadata?.positionY ?? 0,
  }
}

export function generateNodeHash(node: HashProperties) {
  return hash(`${node.nodeType}-${node.positionX}-${node.positionY}`)
}

export function generateBehaveNodeHash(node: INode) {
  return generateNodeHash(formatBehaveNodeForHash(node))
}
