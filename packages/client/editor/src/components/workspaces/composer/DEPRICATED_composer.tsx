import { useConfig, usePubSub } from '@magickml/providers'
import {
  DockviewApi,
  DockviewDndOverlayEvent,
  DockviewDropEvent,
  DockviewReact,
  DockviewReadyEvent,

  IDockviewPanelProps,
  SerializedDockview,
  SerializedGridviewComponent,
  positionToDirection,
} from 'dockview'
import { useEffect, useRef, useState } from 'react'
import { SpellInterface } from 'server/schemas'
import { spellApi } from 'client/state'

import { debounce } from '../../../utils/debounce'
import EventHandler from '../../EventHandler/EventHandler'

import EditorWindow from '../../EditorWindow'
import Inspector from '../../InspectorWindow/InspectorWindow'
import Playtest from '../../PlaytestWindow/PlaytestWindow'

import Console from '../../DebugConsole'
import { useEditor } from '../../../contexts/EditorProvider'
import { Tab } from '@magickml/providers';
import { useSelector } from 'react-redux'
import { RootState } from 'client/state'
import LockIcon from '@mui/icons-material/Lock';
import TextEditor from '../../_DEPRICATED_/TextEditorWindow'

const generateLayoutKey = (spellid: string, agentId: string, projectId: string,) => {
  return `${projectId}/composer_layout_${spellid}/${agentId || 'draft-agent'}`
}

const getLayoutFromLocalStorage = (spellId: string, currentAgentId: string | undefined, projectId: string) => {
  const key = generateLayoutKey(spellId, currentAgentId, projectId)
  const layout = localStorage.getItem(key)
  return layout ? JSON.parse(layout) : null
}

const saveLayoutToLocalStorage = (spellId: string, currentAgentId: string | undefined, projectId: string, layout: any) => {
  const key = generateLayoutKey(spellId, currentAgentId, projectId)
  localStorage.setItem(key, JSON.stringify(layout))
}

const getLayoutFromLocalStorage = (spellId: string) => {
  const layout = localStorage.getItem(`composer_layout_${spellId}`)
  return layout ? JSON.parse(layout) : null
}

const saveLayoutToLocalStorage = (spellId: string, layout: any) => {
  localStorage.setItem(`composer_layout_${spellId}`, JSON.stringify(layout))
}

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
  const [api, setApi] = useState<DockviewApi>(null)
  const { events, publish, subscribe } = usePubSub()
  const [loadSpell, { data: spellData }] = spellApi.useLazyGetSpellByIdQuery()
  const { editor, serialize } = useEditor()
  const preferences = useSelector((state: RootState) => state.preferences)
  const globalConfig = useSelector((state: RootState) => state.globalConfig)
  const { currentAgentId: _currentAgentId } = globalConfig
  const currentAgentRef = useRef(_currentAgentId)

  useEffect(() => {
    currentAgentRef.current = _currentAgentId
  }, [_currentAgentId])

  const { currentSpellReleaseId } = useSelector<RootState, RootState['globalConfig']>(
    state => state.globalConfig
  )

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
    const layout = getLayoutFromLocalStorage(spellId, currentAgentRef.current, config.projectId)

    let success = false;

    if (layout) {
      event.api.fromJSON(layout);
      success = true;
    }

    if (!success) {
      loadDefaultLayout(event.api, tab, spellId)
    }

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

    api.onDidLayoutChange(() => {
      const layout = api.toJSON()

      console.log('SETTING LAYOUT', layout)

      saveLayoutToLocalStorage(spellId, currentAgentRef.current, config.projectId, layout)
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

  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    background: 'rgba(0, 0, 0, 0.5)',
    display: currentSpellReleaseId ? 'flex' : 'none',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  };

  const overlayContentStyle: React.CSSProperties = {
    textAlign: 'center',
    // color: 'white',
    // fontSize: '1.5rem',
  };

  return (
    <>
      {currentSpellReleaseId && (
        <div style={overlayStyle} onClick={(e) => e.stopPropagation()}>
          <div style={overlayContentStyle}>
            <div><i className="fa fa-lock" aria-hidden="true"></i></div> {/* FontAwesome lock icon */}
            <h2>Modifying live spells is currently unavailable</h2>
            <p>Make changes to your draft agent and then publish a release!</p>
          </div>
          <LockIcon style={{ fontSize: '40px', marginTop: '8px' }} />
        </div>
      )}
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
