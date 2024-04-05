import React from 'react'
import { type Tab } from '@magickml/providers'
import { SpellInterfaceWithGraph } from 'server/schemas'
import { BaseFlow } from './base-flow'
import { useBehaveGraphFlow } from '../hooks'
import { getNodeSpec } from 'shared/nodeSpec'

type ReadOnlyFlowProps = {
  spell: SpellInterfaceWithGraph
  parentRef: React.RefObject<HTMLDivElement>
  tab: Tab
  windowDimensions: { width: number; height: number }
}

const readonlyTab: Tab = {
  id: 'readonly',
  name: 'readonly',
  type: 'readonly',
}
export const ReadOnlyFlow: React.FC<ReadOnlyFlowProps> = ({
  spell,
  parentRef,
  windowDimensions,
}) => {
  const behaveGraphFlow = useBehaveGraphFlow({
    spell,
    specJson: getNodeSpec(spell),
    tab: readonlyTab,
  })

  return (
    <BaseFlow
      spell={spell}
      parentRef={parentRef}
      tab={readonlyTab}
      readOnly={true}
      windowDimensions={windowDimensions}
      behaveGraphFlow={behaveGraphFlow}
    />
  )
}
