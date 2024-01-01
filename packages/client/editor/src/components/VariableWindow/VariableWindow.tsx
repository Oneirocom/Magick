import { Tab } from '@magickml/providers';
import { Window } from 'client/core'
import { IDockviewPanelProps } from 'dockview';

export const VariableWindow = (props: IDockviewPanelProps<{ tab: Tab, spellId: string }>) => {
  return (
    <Window>
      <div className="p4">

      </div>
    </Window>
  )
}