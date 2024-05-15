import { NodeSpecJSON } from '@magickml/behave-graph'
import { useEffect, useState } from 'react'
import { NodeTypes } from '@xyflow/react'

import { CoreNode } from '../node/core-node'
import { ReadOnlyNode } from '../node/readonly-node'

const getCustomNodeTypes = (
  allSpecs: NodeSpecJSON[],
  spellId: string,
  type: 'readonly' | 'core' = 'core'
) => {
  return allSpecs.reduce((nodes: NodeTypes, node) => {
    nodes[node.type] = props => {
      return type === 'core' ? (
        <CoreNode
          spec={node}
          allSpecs={allSpecs}
          spellId={spellId}
          {...props}
        />
      ) : (
        <ReadOnlyNode
          spec={node}
          allSpecs={allSpecs}
          spellId={spellId}
          {...props}
        />
      )
    }
    return nodes
  }, {})
}

export const useCustomNodeTypes = ({
  specJson,
  spellId,
  type = 'core',
}: {
  specJson: NodeSpecJSON[] | undefined
  spellId: string
  type?: 'readonly' | 'core'
}) => {
  const [customNodeTypes, setCustomNodeTypes] = useState<NodeTypes>()
  useEffect(() => {
    if (!specJson) return
    const customNodeTypes = getCustomNodeTypes(specJson, spellId, type)

    setCustomNodeTypes(customNodeTypes)
  }, [specJson, spellId])

  return customNodeTypes
}
