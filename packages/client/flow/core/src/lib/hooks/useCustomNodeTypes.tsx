import { NodeJSON, NodeSpecJSON } from '@magickml/behave-graph'
import { useEffect, useState } from 'react'
import { NodeTypes } from 'reactflow'

import { CoreNode } from '../node/core-node'
import { ReadOnlyNode } from '../node/readonly-node'
import type { SpellInterfaceWithGraph } from 'server/schemas'

const empty: NodeJSON = {
  id: '',
  type: '',
}

const getCustomNodeTypes = (
  allSpecs: NodeSpecJSON[],
  spell: SpellInterfaceWithGraph,
  type: 'readonly' | 'core' = 'core'
) => {
  return allSpecs.reduce((nodes: NodeTypes, node) => {
    nodes[node.type] = props => {
      const nodeJSON = spell?.graph.nodes?.find(node => node.id === props.id)

      return type === 'core' ? (
        <CoreNode
          spec={node}
          nodeJSON={nodeJSON || empty}
          allSpecs={allSpecs}
          spell={spell}
          {...props}
        />
      ) : (
        <ReadOnlyNode
          spec={node}
          nodeJSON={nodeJSON || empty}
          allSpecs={allSpecs}
          spell={spell}
          {...props}
        />
      )
    }
    return nodes
  }, {})
}

export const useCustomNodeTypes = ({
  specJson,
  spell,
  type = 'core',
}: {
  specJson: NodeSpecJSON[] | undefined
  spell: SpellInterfaceWithGraph
  type?: 'readonly' | 'core'
}) => {
  const [customNodeTypes, setCustomNodeTypes] = useState<NodeTypes>()
  useEffect(() => {
    if (!specJson) return
    const customNodeTypes = getCustomNodeTypes(specJson, spell, type)

    setCustomNodeTypes(customNodeTypes)
  }, [specJson, spell])

  return customNodeTypes
}
