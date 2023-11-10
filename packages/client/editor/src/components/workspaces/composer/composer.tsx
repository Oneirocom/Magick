import { useConfig, usePubSub } from '@magickml/providers'
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

import { debounce } from '../../../utils/debounce'
import EventHandler from '../../EventHandler/EventHandler'

import EditorWindow from '../../EditorWindow'
import Inspector from '../../InspectorWindow/InspectorWindow'
import Playtest from '../../PlaytestWindow/PlaytestWindow'

import Console from '../../DebugConsole'
import TextEditor from '../../TextEditorWindow'
import { useEditor } from '../../../contexts/EditorProvider'
import { Tab } from '@magickml/providers';
import { useSelector } from 'react-redux'
import { RootState } from 'client/state'

function loadDefaultLayout(api: DockviewApi, tab, spellId) {
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
      spellId
    },
  })

  api
    .addPanel({
      id: 'Inspector',
      component: 'Inspector',
      params: {
        title: 'Inspector',
        tab,
        spellId
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
      spellId
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
        spellId
      },
      position: { referencePanel: 'Composer', direction: 'below' },
    })
    .api.setSize({
      height: 300,
    })

  api.addPanel({
    id: 'Console',
    component: 'Console',
    params: {
      title: 'Console',
      tab,
      spellId
    },
    position: { referencePanel: 'Playtest', direction: 'right' },
  })
}

const components = {
  default: (props: IDockviewPanelProps<{ title: string, spellId: string }>) => {
    return (
      <div style={{ padding: '20px', color: 'white' }}>
        {props.params.title}
      </div>
    )
  },
  Playtest: (props: IDockviewPanelProps<{ tab: Tab, spellId: string }>) => {
    return <Playtest {...props.params} />
  },
  Inspector: (props: IDockviewPanelProps<{ tab: Tab, spellId: string }>) => {
    return <Inspector {...props.params} />
  },
  TextEditor: (props: IDockviewPanelProps<{ tab: Tab, spellId: string }>) => {
    return <TextEditor {...props.params} />
  },
  EditorWindow: (props: IDockviewPanelProps<{ tab: Tab, spellId: string }>) => {
    return <EditorWindow {...props.params} />
  },
  Console: (props: IDockviewPanelProps<{ tab: Tab, spellId: string }>) => {
    return <Console {...props.params} />
  },
  // AgentControls
}

export const Composer = ({ tab, theme, spellId }) => {
  const pubSub = usePubSub()
  const config = useConfig()
  const spellRef = useRef<SpellInterface>()
  const { events, publish } = usePubSub()
  const [loadSpell, { data: spellData }] = spellApi.useLazyGetSpellByIdQuery()
  const { editor, serialize } = useEditor()
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
      id: spellId,
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
    loadDefaultLayout(event.api, tab, spellId)
    // }
  }

  const onDidDrop = (event: DockviewDropEvent) => {
    const component = event.nativeEvent.dataTransfer.getData('component')
    const title = event.nativeEvent.dataTransfer.getData('title')
    event.api.addPanel({
      id: component,
      component: component,
      position: {
        direction: positionToDirection(event.position),
        referenceGroup: event.group || undefined,
      },
      params: {
        title: title ? title : component,
        tab,
        spellId
      }
    });
  };

  const showDndOverlay = (event: DockviewDndOverlayEvent) => {
    return true;
  };

  return (
    <>
      <EventHandler tab={tab} pubSub={pubSub} spellId={spellId} />
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