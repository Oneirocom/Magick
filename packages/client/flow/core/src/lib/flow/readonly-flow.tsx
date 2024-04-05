import React from 'react'
import { type Tab, usePubSub } from '@magickml/providers'
import { SpellInterfaceWithGraph } from 'server/schemas'
import { useSelector } from 'react-redux'
import { RootState, useSelectAgentsSpell } from 'client/state'
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
  const globalConfig = useSelector((state: RootState) => state.globalConfig)
  const { lastItem: lastSpellEvent } = useSelectAgentsSpell()
  const pubSub = usePubSub()

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
      pubSub={pubSub}
      globalConfig={globalConfig}
      lastSpellEvent={lastSpellEvent}
    />
  )
}
