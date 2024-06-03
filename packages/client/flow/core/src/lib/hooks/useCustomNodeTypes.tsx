'use client'

import { NodeSpecJSON } from '@magickml/behave-graph'
import { useEffect, useState } from 'react'
import { NodeProps, NodeTypes } from '@xyflow/react'

import { CoreNode } from '../node/core-node'

import { ReadOnlyNode } from '../node/readonly-node'
import { SubspellNode } from '../nodeTypes/subspell'

type Props = NodeProps & {
  data: any
  type: any
}

const getCoreNode = (
  spec: NodeSpecJSON,
  allSpecs: NodeSpecJSON[],
  spellId: string,
  props: Props
) => {
  switch (spec.type) {
    case 'action/subspell/run':
      return (
        <SubspellNode
          spec={spec}
          allSpecs={allSpecs}
          spellId={spellId}
          {...props}
        />
      )
    default: {
      return (
        <CoreNode
          spec={spec}
          allSpecs={allSpecs}
          spellId={spellId}
          {...props}
        />
      )
    }
  }
}

const getCustomNodeTypes = (
  allSpecs: NodeSpecJSON[],
  spellId: string,
  type: 'readonly' | 'core' = 'core'
) => {
  return allSpecs.reduce((nodes: NodeTypes, node) => {
    nodes[node.type] = props => {
      return type === 'core' ? (
        getCoreNode(node, allSpecs, spellId, props)
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
