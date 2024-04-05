import React from 'react'
import { useSelector } from 'react-redux'
import { selectActiveInput, useSelectAgentsSpell } from 'client/state'
import { BaseNode } from './base-node'

type BaseNodeProps = React.ComponentProps<typeof BaseNode>
type ReadOnlyNodeProps = Omit<
  BaseNodeProps,
  'activeInput' | 'setActiveInput' | 'onResetNodeState' | 'spellEvent'
>

export const ReadOnlyNode: React.FC<ReadOnlyNodeProps> = props => {
  const { id, spec, spell, ...rest } = props
  const { lastItem: spellEvent } = useSelectAgentsSpell()
  const activeInput = useSelector(selectActiveInput)

  const onResetNodeState = () => {
    console.log('Resetting node state')
  }

  const setActiveInputWrapper = (
    input: { nodeId: string; name: string } | null
  ) => {
    // Dummy setActiveInput logic
    console.log('Setting active input:', input)
  }

  return (
    <BaseNode
      {...props}
      activeInput={activeInput}
      setActiveInput={setActiveInputWrapper}
      onResetNodeState={onResetNodeState}
      spellEvent={spellEvent}
    />
  )
}
