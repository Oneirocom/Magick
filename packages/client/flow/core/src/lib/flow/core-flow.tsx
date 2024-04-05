import React from 'react'
import { Tab, usePubSub } from '@magickml/providers'
import { SpellInterfaceWithGraph } from 'server/schemas'
import { useSelector } from 'react-redux'
import { RootState, useSelectAgentsSpell } from 'client/state'
import { BaseFlow } from './base-flow'
import { useBehaveGraphFlow } from '../hooks'
import { getNodeSpec } from 'shared/nodeSpec'

type FlowProps = {
  spell: SpellInterfaceWithGraph
  parentRef: React.RefObject<HTMLDivElement>
  tab: Tab
  readOnly?: boolean
  windowDimensions: { width: number; height: number }
}

export const CoreFlow: React.FC<FlowProps> = ({
  spell,
  parentRef,
  tab,
  readOnly = false,
  windowDimensions,
}) => {
  const globalConfig = useSelector((state: RootState) => state.globalConfig)
  const { lastItem: lastSpellEvent } = useSelectAgentsSpell()
  const pubSub = usePubSub()

  const behaveGraphFlow = useBehaveGraphFlow({
    spell,
    specJson: getNodeSpec(spell),
    tab,
  })

  return (
    <BaseFlow
      spell={spell}
      parentRef={parentRef}
      tab={tab}
      readOnly={readOnly}
      windowDimensions={windowDimensions}
      behaveGraphFlow={behaveGraphFlow}
      pubSub={pubSub}
      globalConfig={globalConfig}
      lastSpellEvent={lastSpellEvent}
    />
  )
}
