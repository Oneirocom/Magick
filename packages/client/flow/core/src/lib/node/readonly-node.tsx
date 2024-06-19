'use client'

import React from 'react'
import { BaseNode } from './base-node'

type BaseNodeProps = React.ComponentProps<typeof BaseNode>
type ReadOnlyNodeProps = Omit<
  BaseNodeProps,
  | 'activeInput'
  | 'setActiveInput'
  | 'onResetNodeState'
  | 'spellEvent'
  | 'resetNodeState'
>

export const ReadOnlyNode: React.FC<ReadOnlyNodeProps> = props => {
  const { id, spec, spellId, ...rest } = props

  const spellEvent = null

  const onResetNodeState = () => {
    // Dummy onResetNodeState logic
  }

  return (
    <BaseNode
      id={id}
      spec={spec}
      spellId={spellId}
      {...rest}
      onResetNodeState={onResetNodeState}
      spellEvent={spellEvent}
    />
  )
}
