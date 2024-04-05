import { NodeJSON, NodeSpecJSON } from '@magickml/behave-graph'
import { useEffect, useState } from 'react'
import { NodeTypes } from 'reactflow'

import { Node } from '../node/node'
import type { SpellInterfaceWithGraph } from 'server/schemas'
import { Tab } from '@magickml/providers'

const empty: NodeJSON = {
  id: '',
  type: '',
}

const getCustomNodeTypes = (
  allSpecs: NodeSpecJSON[],
  spell: SpellInterfaceWithGraph
) => {
  return allSpecs.reduce((nodes: NodeTypes, node) => {
    nodes[node.type] = props => {
      const nodeJSON = spell?.graph.nodes?.find(node => node.id === props.id)

      return (
        <Node
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
}: {
  specJson: NodeSpecJSON[] | undefined
  spell: SpellInterfaceWithGraph
  tab: Tab
}) => {
  const [customNodeTypes, setCustomNodeTypes] = useState<NodeTypes>()
  useEffect(() => {
    if (!specJson) return
    const customNodeTypes = getCustomNodeTypes(specJson, spell)

    setCustomNodeTypes(customNodeTypes)
  }, [specJson, spell])

  return customNodeTypes
}
