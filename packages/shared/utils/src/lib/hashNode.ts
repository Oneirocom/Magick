import { INode } from '@magickml/behave-graph'
import crypto from 'crypto'

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
  const hash = crypto.createHash('sha256')
  hash.update(`${node.nodeType}-${node.positionX}-${node.positionY}`)
  return hash.digest('hex')
}

export function generateBehaveNodeHash(node: INode) {
  return generateNodeHash(formatBehaveNodeForHash(node))
}
