import {
  DockviewApi,
  DockviewDndOverlayEvent,
  DockviewDropEvent,
  DockviewReact,
  DockviewReadyEvent,

  IDockviewPanelProps,
  positionToDirection,
} from 'dockview'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { SpellInterface } from 'shared/core'
import { spellApi } from 'client/state'
import { Tab } from '@magickml/providers';
import { useConfig, usePubSub } from '@magickml/providers'
import { RootState } from 'client/state'
import { GraphJSON } from '@magickml/behave-graph'

import Branch from '../../../graphs/core/flow/Branch.json'
import graph from '../../../graphs/graph.json'

import { debounce } from '../../../utils/debounce'
import EventHandler from '../../EventHandler/EventHandler'

import Inspector from '../../InspectorWindow/InspectorWindow'

import Console from '../../DebugConsole'
import TextEditor from '../../TextEditorWindow'
import { useEditor } from '../../../contexts/EditorProvider'
import { useRegistry } from '../../../hooks/react-flow/useRegistry'
import { Flow } from '../../react-flow/Flow'
import { usePanelControls } from '../../../hooks/usePanelControls'
import ChatWindow from '../../ChatWindow/ChatWindow'
import { PropertiesWindow } from '../../PropertiesWindow/PropertiesWindow'
import GraphWindow from '../../GraphWindow/GraphWindow'

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
    id: 'Graph',
    component: 'Graph',
    params: {
      title: 'Graph',
      tab,
      spellId
    },
  })

  api
    .addPanel({
      id: 'Properties',
      component: 'Properties',
      params: {
        title: 'Properties',
        tab,
        spellId
      },
      position: { referencePanel: 'Graph', direction: 'left' },
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
    position: { referencePanel: 'Properties', direction: 'below' },
  })

  // panel5.group!.model.header.hidden = true;
  // panel5.group!.model.locked = true;

  api
    .addPanel({
      id: 'Chat',
      component: 'Chat',
      params: {
        title: 'Chat',
        tab,
        spellId
      },
      position: { referencePanel: 'Graph', direction: 'below' },
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
    position: { referencePanel: 'Chat', direction: 'right' },
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
  Chat: (props: IDockviewPanelProps<{ tab: Tab, spellId: string }>) => {
    return <ChatWindow {...props.params} />
  },
  Inspector: (props: IDockviewPanelProps<{ tab: Tab, spellId: string }>) => {
    return <Inspector {...props.params} />
  },
  Properties: (props: IDockviewPanelProps<{ tab: Tab, spellId: string }>) => {
    return <PropertiesWindow {...props.params} />
  },
  TextEditor: (props: IDockviewPanelProps<{ tab: Tab, spellId: string }>) => {
    return <TextEditor {...props.params} />
  },
  Graph: GraphWindow,
  Console: (props: IDockviewPanelProps<{ tab: Tab, spellId: string }>) => {
    return <Console {...props.params} />
  },
  // AgentControls
}

export const Composer = ({ tab, theme, spellId }) => {
  const pubSub = usePubSub()
  const config = useConfig()
  const spellRef = useRef<SpellInterface>()
  const [api, setApi] = useState<DockviewApi>(null)
  const { events, publish, subscribe } = usePubSub()
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
    setApi(event.api)
  }

  useEffect(() => {
    if (!api) return

    const unsubscribe = subscribe(events.$CREATE_TEXT_EDITOR(tab.id), () => {
      api.addPanel({
        id: 'Text Editor',
        component: 'TextEditor',
        params: {
          title: 'Text Editor',
          tab,
          spellId
        },
      })
    })

    return () => {
      unsubscribe()
    }
  }, [api])

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