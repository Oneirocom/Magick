import { GridviewReact, IGridviewPanelProps, Orientation } from 'dockview';
import WorkspaceProvider from '../../../contexts/WorkspaceProvider'
import { Tab, useDockviewTheme } from 'client/state';
import { usePubSub } from '@magickml/providers';
import { Composer } from './composer';


const DraggableElement = (props) => {
  const { tab } = props.params
  const { publish, events } = usePubSub()
  const windows = {
    'Console': () => {
      publish(events.$CREATE_CONSOLE(tab.id))
    },
    'TextEditor': () => {
      publish(events.$CREATE_TEXT_EDITOR(tab.id))
    },
    'Properties': () => {
      publish(events.$CREATE_INSPECTOR(tab.id))
    },
    'Chat': () => {
      publish(events.$CREATE_PLAYTEST(tab.id))
    }
  }

  const handleClick = () => {
    windows[props.window]()
  }

  return (
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
      onClick={handleClick}
      draggable={true}
      className='p-2 text-white transition-all cursor-pointer hover:bg-gray-600'
    >
      {props.window}
    </p>
  )
};

const composerLayoutComponents = {
  WindowBar: (props: IGridviewPanelProps<{ title: string }>) => {
    return (
      <div>
        <div style={{ width: '100%', display: 'inline-flex', justifyContent: 'flex-end', flexDirection: 'row', gap: '8px', padding: "0 16px" }}>
          <p style={{ padding: 8, color: 'grey', marginRight: 50 }}>Composer V2</p>
          <DraggableElement window="Console" {...props} />
          <DraggableElement window="TextEditor" title="Text Editor" {...props} />
          <DraggableElement window="Properties" {...props} />
          <DraggableElement window="Chat" {...props} />
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
      params: {
        ...props.params
      }
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