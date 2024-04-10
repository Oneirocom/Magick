import React from 'react'
import { BaseNode } from './base-node'

type BaseNodeProps = React.ComponentProps<typeof BaseNode>
type ReadOnlyNodeProps = Omit<
  BaseNodeProps,
  'activeInput' | 'setActiveInput' | 'onResetNodeState' | 'spellEvent'
>

export const ReadOnlyNode: React.FC<ReadOnlyNodeProps> = props => {
  const { id, spec, spell, ...rest } = props

  const activeInput = null
  const spellEvent = null

  const onResetNodeState = () => {
    // Dummy onResetNodeState logic
  }

  const setActiveInputWrapper = (
    input: { nodeId: string; name: string } | null
  ) => {
    // Dummy setActiveInput logic
  }

  return (
    <BaseNode
      id={id}
      spec={spec}
      spell={spell}
      {...rest}
      activeInput={activeInput}
      setActiveInput={setActiveInputWrapper}
      onResetNodeState={onResetNodeState}
      spellEvent={spellEvent}
    />
  )
}
