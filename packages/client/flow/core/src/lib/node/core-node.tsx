'use client'

import React, { useEffect, useState } from 'react'
import { enqueueSnackbar } from 'notistack'
import { usePubSub } from '@magickml/providers'
import { useSelectAgentsSpell } from 'client/state'
import { BaseNode } from './base-node'

type BaseNodeProps = React.ComponentProps<typeof BaseNode>
export type CoreNodeProps = Omit<
  BaseNodeProps,
  | 'activeInput'
  | 'setActiveInput'
  | 'onResetNodeState'
  | 'spellEvent'
  | 'resetNodeState'
>

export const CoreNode: React.FC<CoreNodeProps> = props => {
  const { id, spellId } = props
  const { events, subscribe } = usePubSub()
  const { lastItem: spellEvent } = useSelectAgentsSpell()
  const [resetNodeState, setResetNodeState] = useState(false)

  useEffect(() => {
    const unsubscribe = subscribe(events.RESET_NODE_STATE, () => {
      setTimeout(() => {
        onResetNodeState()
      }, 1000)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const onResetNodeState = () => {
    // Reset node state logic
    setResetNodeState(true)
    setTimeout(() => {
      setResetNodeState(false)
    }, 100)
  }

  useEffect(() => {
    if (!spellEvent) return
    if (spellEvent.event === `${spellId}-${id}-error`) {
      const truncatedMessage =
        spellEvent.message.length > 100
          ? spellEvent.message.substring(
              0,
              spellEvent.message.lastIndexOf(' ', 10)
            ) + '...'
          : spellEvent.message

      enqueueSnackbar(truncatedMessage, {
        variant: 'error',
      })
    }
  }, [spellEvent])

  return (
    <BaseNode
      {...props}
      resetNodeState={resetNodeState}
      onResetNodeState={onResetNodeState}
      spellEvent={spellEvent}
    />
  )
}
