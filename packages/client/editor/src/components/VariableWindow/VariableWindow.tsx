import { Tab } from '@magickml/providers';
import { Window } from 'client/core'
import { useGetSpellQuery } from 'client/state';
import { IDockviewPanelProps } from 'dockview';

export const VariableWindow = (props: IDockviewPanelProps<{ tab: Tab, spellId: string }>) => {
  const { tab, spellId } = props.params

  const { data: spell } = useGetSpellQuery({ id: spellId })

  return (
    <Window>
      <div className="p4">

      </div>
    </Window>
  )
}