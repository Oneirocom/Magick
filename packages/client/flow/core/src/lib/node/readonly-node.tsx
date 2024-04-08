import React from 'react'
import { BaseNode } from './base-node'

type BaseNodeProps = React.ComponentProps<typeof BaseNode>
type ReadOnlyNodeProps = Omit<
  BaseNodeProps,
  'activeInput' | 'setActiveInput' | 'onResetNodeState' | 'spellEvent'
>

export const ReadOnlyNode: React.FC<ReadOnlyNodeProps> = props => {
  const { id, spec, spell, ...rest } = props
  // const { lastItem: spellEvent } = useSelectAgentsSpell()
  // const activeInput = useSelector(selectActiveInput)

  const activeInput = {
    name: 'input',
    inputType: 'text',
    value: 'value',
    nodeId: '',
  }
  const spellEvent = {
    event: 'event',
    message: 'message',
  }

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
      {...props}
      activeInput={activeInput}
      setActiveInput={setActiveInputWrapper}
      onResetNodeState={onResetNodeState}
      spellEvent={spellEvent}
    />
  )
}
