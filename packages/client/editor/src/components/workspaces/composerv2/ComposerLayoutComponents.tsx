import { IGridviewPanelProps } from 'dockview'
// import { DraggableElement } from './DraggableElement'
import { Composer } from './composer'
import { Tab } from '@magickml/providers'

export const composerLayoutComponents = {
  WindowBar: (props: IGridviewPanelProps<{ title: string }>) => {
    return <div className="flex justify-end items-center gap-4 p-4 h-9"></div>
  },
  Composer: (
    props: IGridviewPanelProps<{
      tab: Tab
      theme: string
      spellId: string
      spellName: string
    }>
  ) => {
    return (
      <Composer
        spellId={props.params.spellId}
        theme={`
        composer-layout
        ${props.params.theme}
        `}
        tab={props.params.tab}
        spellName={props.params.spellName}
      />
    )
  },
}
