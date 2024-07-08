'use client'

import React, { useEffect, useMemo } from 'react'
import { Tab, usePubSub } from '@magickml/providers'
import { SpellInterfaceWithGraph } from '@magickml/agent-server-schemas'
import { useSelector } from 'react-redux'
import { RootState } from 'client/state'
import { BaseFlow } from './base-flow'
import { useBehaveGraphFlow, useFlowHandlers } from '../hooks'
import { getNodeSpec } from '@magickml/node-spec'

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
  const pubSub = usePubSub()

  const specJSON = useMemo(() => getNodeSpec(), [])

  useEffect(() => {
    if (!specJSON) return
    console.log('Total nodes specs:', specJSON.length)
  }, [specJSON])

  const behaveGraphFlow = useBehaveGraphFlow({
    spell,
    specJson: specJSON,
    tab,
  })

  const flowHandlers = useFlowHandlers({
    ...behaveGraphFlow,
    specJSON,
    parentRef,
    tab,
    windowDimensions,
    spell,
  })

  return (
    <BaseFlow
      spell={spell}
      specJSON={specJSON}
      parentRef={parentRef}
      tab={tab}
      readOnly={readOnly}
      windowDimensions={windowDimensions}
      behaveGraphFlow={behaveGraphFlow}
      flowHandlers={flowHandlers}
      pubSub={pubSub}
      globalConfig={globalConfig}
    />
  )
}
