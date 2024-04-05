import React from 'react'
import { type Tab } from '@magickml/providers'
import { SpellInterfaceWithGraph } from 'server/schemas'
import { BaseFlow } from './base-flow'
import { useCustomNodeTypes } from '../hooks'
import { getNodeSpec } from 'shared/nodeSpec'
import { behaveToFlow } from '../utils/transformers/behaveToFlow'

type ReadOnlyFlowProps = {
  spell: SpellInterfaceWithGraph
  parentRef: React.RefObject<HTMLDivElement>
  windowDimensions: { width: number; height: number }
}

// dummy implementations
const tab: Tab = {
  id: 'readonly',
  name: 'readonly',
  type: 'readonly',
}

const onEdgesChange = () => (): void => {}

const onNodesChange = () => (): void => {}

const setGraphJson = (): void => {}

export const ReadOnlyFlow: React.FC<ReadOnlyFlowProps> = ({
  spell,
  parentRef,
  windowDimensions,
}) => {
  const nodeTypes = useCustomNodeTypes({
    spell,
    specJson: getNodeSpec(spell),
  })

  const [nodes, edges] = behaveToFlow(spell)

  return (
    <BaseFlow
      spell={spell}
      parentRef={parentRef}
      tab={tab}
      readOnly={true}
      windowDimensions={windowDimensions}
      behaveGraphFlow={{
        nodes,
        edges,
        nodeTypes,
        setGraphJson,
        onNodesChange,
        onEdgesChange,
      }}
    />
  )
}
