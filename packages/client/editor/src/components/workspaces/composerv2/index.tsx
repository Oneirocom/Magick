import { GridviewReact, IGridviewPanelProps, Orientation } from 'dockview';
import WorkspaceProvider from '../../../contexts/WorkspaceProvider'
import { Tab, useDockviewTheme } from 'client/state';
import { usePubSub } from '@magickml/providers';
import { Composer } from './composer';

const DraggableElement = (props) => (
  <p
    tabIndex={-1}
    onDragStart={(event) => {
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';

        event.dataTransfer.setData('text/plain', 'nothing');
        event.dataTransfer.setData('component', props.window)
        event.dataTransfer.setData('title', props.title)
      }
    }}
    style={{
      padding: '8px',
      color: 'white',
      cursor: 'pointer',
    }}
    draggable={true}
  >
    {props.window}
  </p>
);

const composerLayoutComponents = {
  WindowBar: () => {
    return (
      <div>
        <div style={{ width: '100%', display: 'inline-flex', justifyContent: 'flex-end', flexDirection: 'row', gap: '8px', padding: "0 16px" }}>
          <p style={{ padding: 8, color: 'grey', marginRight: 50 }}>Composer V2</p>
          <DraggableElement window="Console" />
          <DraggableElement window="TextEditor" title="Text Editor" />
          <DraggableElement window="Properties" />
          <DraggableElement window="Playtest" />
          <DraggableElement window="Chat" />
        </div>
      </div >
    )
  },
  Composer: (props: IGridviewPanelProps<{ tab: Tab, theme: string, spellId: string }>) => {
    return <Composer {...props.params} spellId={props.params.spellId} theme={`composer-layout ${props.params.theme}`} tab={props.params.tab} />
  }
}

const ComposerContainer = (props: IGridviewPanelProps<{ tab: Tab; theme: string, spellId: string }>) => {
  const { theme } = useDockviewTheme()
  const pubSub = usePubSub()

  const onReady = (event) => {
    event.api.addPanel({
      id: 'WindowBar',
      component: 'WindowBar',
      maximumHeight: 30,
      minimumHeight: 30,
    })

    event.api.addPanel({
      id: 'Composer',
      component: 'Composer',
      params: {
        title: 'Composer',
        // pass through params to main composer component
        ...props.params
      },
      position: { referencePanel: 'WindowBar', direction: 'below' },
    })
  }

  return (
    <WorkspaceProvider tab={props.params.tab} pubSub={pubSub} spellId={props.params.spellId}>
      <GridviewReact
        components={composerLayoutComponents}
        disableAutoResizing={false}
        proportionalLayout={false}
        orientation={Orientation.VERTICAL}
        hideBorders={true}
        onReady={onReady}
        className={`global-layout ${theme}`}
      /></WorkspaceProvider>)
}

export default ComposerContainer