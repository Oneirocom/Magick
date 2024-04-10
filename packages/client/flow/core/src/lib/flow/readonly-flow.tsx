import React, { useMemo } from 'react'
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
  console.log('loading readonly flow: ', spell.id, spell.name)

  const specJson = useMemo(() => getNodeSpec(spell), [spell])

  const nodeTypes = useCustomNodeTypes({
    spell,
    specJson,
    type: 'readonly',
  })

  const [nodes, edges] = useMemo(() => {
    const [flowNodes, flowEdges] = behaveToFlow(spell.graph)
    return [flowNodes, flowEdges]
  }, [spell.graph])

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
      flowHandlers={{
        handleOnConnect: () => {},
        handleStartConnect: () => {},
        handleStopConnect: () => {},
        handlePaneClick: () => {},
        handlePaneContextMenu: () => {},
        nodePickerPosition: { x: 0, y: 0 },
        pickedNodeVisibility: { x: 0, y: 0 },
        handleAddNode: () => {},
        closeNodePicker: () => {},
        nodePickFilters: undefined,
        nodeMenuVisibility: { x: 0, y: 0 },
        handleNodeContextMenu: () => {},
        openNodeMenu: false,
        setOpenNodeMenu: () => {},
        nodeMenuActions: [],
        isValidConnectionHandler: () => true,
        onEdgeUpdate: () => {},
      }}
    />
  )
}
