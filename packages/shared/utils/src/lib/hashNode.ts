import { INode } from '@magickml/behave-graph'
import crypto from 'crypto'

export function generateNodeHash(node: INode) {
  const hash = crypto.createHash('sha256')
  hash.update(
    `${node.nodeType}-${node.description.typeName}-${node.metadata.positionX}-${node.metadata.positionY}`
  )
  return hash.digest('hex')
}
