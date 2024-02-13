import { IGridviewPanelProps, Tab } from 'dockview'
import { DraggableElement } from './DraggableElement'
import { Composer } from './composer'

export const composerLayoutComponents = {
  WindowBar: (props: IGridviewPanelProps<{ title: string }>) => {
    return (
      <div className="flex justify-end items-center gap-4 p-4">
        <p className="text-gray-400 mr-12">Composer V2</p>
        <DraggableElement window="Console" {...props} />
        <DraggableElement window="TextEditor" title="Text Editor" {...props} />
        <DraggableElement window="Test" {...props} />
        <DraggableElement window="Variables" {...props} />
      </div>
    )
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
