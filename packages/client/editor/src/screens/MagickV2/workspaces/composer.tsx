import { useConfig, useFeathers, usePubSub } from '@magickml/providers'
import {
  DockviewApi,
  DockviewDndOverlayEvent,
  DockviewDropEvent,
  DockviewReact,
  DockviewReadyEvent,
  IDockviewPanelProps,
  positionToDirection,
} from 'dockview'
import { useEffect, useRef } from 'react'
import { SpellInterface } from 'shared/core'
import { spellApi } from 'client/state'

import WorkspaceProvider from '../../../contexts/WorkspaceProvider'
import { debounce } from '../../../utils/debounce'
import EventHandler from '../../../components/EventHandler'

import EditorWindow from '../../../windows/EditorWindow'
import Inspector from '../../../windows/InspectorWindow'
import Playtest from '../../../windows/PlaytestWindow'

import DebugConsole from '../../../windows/DebugConsole'
import TextEditor from '../../../windows/TextEditorWindow'
import { useEditor } from '../../../contexts/EditorProvider'
import { Tab } from '@magickml/providers';
import { useSelector } from 'react-redux'
import { RootState } from 'client/state'

function loadDefaultLayout(api: DockviewApi, tab) {
  const panel = api.addPanel({
    id: 'panel_1',
    component: 'default',
    params: {
      title: 'Panel 1',
    },
  })

  panel.group.locked = true
  panel.group.header.hidden = true

  api.addPanel({
    id: 'Composer',
    component: 'EditorWindow',
    params: {
      title: 'Composer',
      tab,
    },
  })

  api
    .addPanel({
      id: 'Inspector',
      component: 'Inspector',
      params: {
        title: 'Inspector',
        tab,
      },
      position: { referencePanel: 'Composer', direction: 'left' },
    })
    .api.setSize({
      width: 300,
    })

  api.addPanel({
    id: 'Text Editor',
    component: 'TextEditor',
    params: {
      title: 'Text Editor',
      tab,
    },
    position: { referencePanel: 'Inspector', direction: 'below' },
  })

  // panel5.group!.model.header.hidden = true;
  // panel5.group!.model.locked = true;

  api
    .addPanel({
      id: 'Playtest',
      component: 'Playtest',
      params: {
        title: 'Playtest',
        tab,
      },
      position: { referencePanel: 'Composer', direction: 'below' },
    })
    .api.setSize({
      height: 300,
    })

  api.addPanel({
    id: 'Console',
    component: 'DebugConsole',
    params: {
      title: 'Console',
      tab,
    },
    position: { referencePanel: 'Playtest', direction: 'right' },
  })
}

const components = {
  default: (props: IDockviewPanelProps<{ title: string }>) => {
    return (
      <div style={{ padding: '20px', color: 'white' }}>
        {props.params.title}
      </div>
    )
  },
  Playtest: (props: IDockviewPanelProps<{ tab: Tab }>) => {
    return <Playtest {...props.params} />
  },
  Inspector: (props: IDockviewPanelProps<{ tab: Tab }>) => {
    return <Inspector {...props.params} />
  },
  TextEditor: (props: IDockviewPanelProps<{ tab: Tab }>) => {
    return <TextEditor {...props.params} />
  },
  EditorWindow: (props: IDockviewPanelProps<{ tab: Tab }>) => {
    return <EditorWindow {...props.params} />
  },
  DebugConsole: (props: IDockviewPanelProps<{ tab: Tab }>) => {
    return <DebugConsole {...props.params} />
  },
  // AgentControls
}

export const Composer = ({ theme, tab, pubSub }) => {
  const config = useConfig()
  const spellRef = useRef<SpellInterface>()
  const { events, publish } = usePubSub()
  const [loadSpell, { data: spellData }] = spellApi.useLazyGetSpellByIdQuery()
  const { editor, serialize } = useEditor()
  const FeathersContext = useFeathers()
  const preferences = useSelector((state: RootState) => state.preferences)

  // Set up autosave for the workspaces
  useEffect(() => {
    if (!editor?.on) return
    const unsubscribe = editor.on(
      'nodecreated noderemoved connectioncreated connectionremoved nodetranslated',
      debounce(async data => {
        if (tab.type === 'spell' && spellRef.current) {
          publish(events.$SAVE_SPELL_DIFF(tab.id), { graph: serialize() })
        }
      }, 1000) // debounce for 2000 ms
    )

    return () => {
      unsubscribe()
    }
  }, [editor, preferences.autoSave])

  useEffect(() => {
    if (!editor?.on) return

    const unsubscribe = editor.on('nodecreated noderemoved', (node: any) => {
      if (!spellRef.current) return
      if (node.category !== 'IO') return
      const spell = {
        ...spellRef.current,
        graph: editor.toJSON(),
      }
      publish(events.$SUBSPELL_UPDATED(spellRef.current.id), spell)
    })

    return () => {
      unsubscribe()
    }
  }, [editor])

  useEffect(() => {
    if (!spellData) return
    spellRef.current = spellData.data[0]
  }, [spellData])

  useEffect(() => {
    // If there is no tab, or we already have a spell, return early
    if (!tab || !tab.name || spellRef.current) return

    loadSpell({
      spellName: tab.name,
      projectId: config.projectId,
      id: tab.id,
    })
  }, [tab])

  const onReady = (event: DockviewReadyEvent) => {
    // const layout = tab.layoutJson;

    // let success = false;

    // if (layout) {
    //   event.api.fromJSON(layout);
    //   success = true;
    // }

    // if (!success) {
    loadDefaultLayout(event.api, tab)
    // }
  }

  const onDidDrop = (event: DockviewDropEvent) => {
    const component = event.nativeEvent.dataTransfer.getData('component')
    event.api.addPanel({
      id: component,
      component: component,
      position: {
        direction: positionToDirection(event.position),
        referenceGroup: event.group || undefined,
      },
      params: {
        title: component,
        tab
      }
    });
  };

  const showDndOverlay = (event: DockviewDndOverlayEvent) => {
    return true;
  };

  return (
    <>
      <EventHandler tab={tab} pubSub={pubSub} />
      <DockviewReact
        onDidDrop={onDidDrop}
        components={components}
        onReady={onReady}
        className={theme}
        showDndOverlay={showDndOverlay}
      />
    </>
  )
}

const DraggableElement = (props) => (
  <p
    tabIndex={-1}
    onDragStart={(event) => {
      console.log("DRAG START")
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';

        event.dataTransfer.setData('text/plain', 'nothing');
        event.dataTransfer.setData('component', props.window)
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

const Wrapped = (props: IDockviewPanelProps<{ tab: Tab; theme: string }>) => {
  const pubSub = usePubSub()
  return (
    <WorkspaceProvider tab={props.params.tab} pubSub={pubSub}>
      <div style={{ width: '100%', display: 'inline-flex', justifyContent: 'flex-end', flexDirection: 'row', gap: '8px', padding: "0 16px" }}>
        <DraggableElement window="DebugConsole" />
        <DraggableElement window="TextEditor" />
        <DraggableElement window="Inspector" />
        <DraggableElement window="Playtest" />
      </div>
      <div style={{ position: 'relative', height: '100%' }}>
        <Composer
          theme={`composer-layout ${props.params.theme}`}
          tab={props.params.tab}
          pubSub={pubSub}
        />
      </div>
    </WorkspaceProvider>
  )
}

export default Wrapped
