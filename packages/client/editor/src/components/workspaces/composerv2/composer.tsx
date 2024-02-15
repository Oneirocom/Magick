import {
  DockviewApi,
  DockviewDefaultTab,
  DockviewDropEvent,
  DockviewReact,
  DockviewReadyEvent,
  IDockviewPanelHeaderProps,
  IDockviewPanelProps,
  positionToDirection,
} from 'dockview'
import { useEffect, useRef, useState } from 'react'
import { Tab } from '@magickml/providers'
import { usePubSub } from '@magickml/providers'
import EventHandler from '../../EventHandler/EventHandler'

import Console from '../../DebugConsole'
import TextEditor from '../../TextEditorWindow'
import ChatWindow from '../../ChatWindow/ChatWindow'
import { PropertiesWindow } from '../../PropertiesWindow/PropertiesWindow'
import GraphWindow from '../../GraphWindow/GraphWindow'
import { useSelector } from 'react-redux'
import { RootState } from 'client/state'
import { VariableWindow } from '../../VariableWindow/VariableWindow'

const getLayoutFromLocalStorage = (spellId: string) => {
  const layout = localStorage.getItem(`composer_layout_${spellId}`)
  return layout ? JSON.parse(layout) : null
}

const saveLayoutToLocalStorage = (spellId: string, layout: any) => {
  localStorage.setItem(`composer_layout_${spellId}`, JSON.stringify(layout))
}

function loadDefaultLayout(api: DockviewApi, tab, spellId, spellName) {
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
      spellId,
      spellName,
    },
  })

  api.addPanel({
    id: 'Properties',
    component: 'Properties',
    tabComponent: 'permanentTab',
    params: {
      title: 'Properties',
      tab,
      spellId,
      spellName,
    },
    position: { referencePanel: 'Graph', direction: 'left' },
  })

  const propertyPanel = api.getPanel('Properties')
  if (propertyPanel) {
    const propertyGroup = propertyPanel.group
    propertyGroup.api.setConstraints({
      minimumWidth: 300,
    })
  }

  api.addPanel({
    id: 'Variables',
    component: 'Variables',
    params: {
      title: 'Variables',
      tab,
      spellId,
      spellName,
    },
    position: { referencePanel: 'Properties', direction: 'below' },
  })

  api
    .addPanel({
      id: 'Test',
      component: 'Test',
      params: {
        title: 'Test',
        tab,
        spellId,
        spellName,
      },
      position: { referencePanel: 'Graph', direction: 'right' },
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
      spellId,
      spellName,
    },
    position: { referencePanel: 'Test', direction: 'below' },
  })
}
const components = {
  default: (props: IDockviewPanelProps<{ title: string; spellId: string }>) => {
    return (
      <div style={{ padding: '20px', color: 'white' }}>
        {props.params.title}
      </div>
    )
  },
  Test: (
    props: IDockviewPanelProps<{ tab: Tab; spellId: string; spellName: string }>
  ) => {
    return <ChatWindow {...props.params} />
  },
  // depricating this one
  Chat: (
    props: IDockviewPanelProps<{ tab: Tab; spellId: string; spellName: string }>
  ) => {
    return <ChatWindow {...props.params} />
  },
  Properties: (
    props: IDockviewPanelProps<{ tab: Tab; spellId: string; spellName: string }>
  ) => {
    return <PropertiesWindow {...props.params} />
  },
  TextEditor: (props: IDockviewPanelProps<{ tab: Tab; spellId: string }>) => {
    return <TextEditor {...props.params} />
  },
  Graph: (
    props: IDockviewPanelProps<{ tab: Tab; spellId: string; spellName: string }>
  ) => {
    return <GraphWindow {...props} />
  },
  Variables: VariableWindow,
  Console: (
    props: IDockviewPanelProps<{ tab: Tab; spellId: string; spellName }>
  ) => {
    return <Console {...props.params} />
  },
}

const PermanentTab = (props: IDockviewPanelHeaderProps) => {
  return <DockviewDefaultTab hideClose {...props} />
}

const tabComponents = {
  permanentTab: PermanentTab,
}

export const Composer = ({ tab, theme, spellId, spellName }) => {
  const pubSub = usePubSub()
  const [api, setApi] = useState<DockviewApi | null>(null)
  const { events, subscribe } = usePubSub()

  const globalConfig = useSelector((state: RootState) => state.globalConfig)
  const { currentAgentId: _currentAgentId } = globalConfig
  const currentAgentRef = useRef(_currentAgentId)

  useEffect(() => {
    currentAgentRef.current = _currentAgentId
  }, [_currentAgentId])

  const onReady = (event: DockviewReadyEvent) => {
    // const layout = tab.layoutJson;
    const layout = getLayoutFromLocalStorage(spellId)

    let success = false

    if (layout) {
      event.api.fromJSON(layout)
      success = true
      event.api.fromJSON(layout)
      success = true
    }

    if (!success) {
      loadDefaultLayout(event.api, tab, spellId, spellName)
    }

    setApi(event.api)
  }

  const windowBarMap = {
    [events.$CREATE_TEXT_EDITOR(tab.id)]: () => {
      api?.addPanel({
        id: 'Text Editor',
        component: 'TextEditor',
        params: {
          title: 'Text Editor',
          tab,
          spellId,
        },
        position: { referencePanel: 'Graph', direction: 'left' },
      })
    },
    [events.$CREATE_PLAYTEST(tab.id)]: () => {
      api?.addPanel({
        id: 'Chat',
        component: 'Chat',
        params: {
          title: 'Chat',
          tab,
          spellId,
        },
        position: { referencePanel: 'Graph', direction: 'below' },
      })
    },
    [events.$CREATE_CONSOLE(tab.id)]: () => {
      api?.addPanel({
        id: 'Console',
        component: 'Console',
        params: {
          title: 'Console',
          tab,
          spellId,
          spellName,
        },
        position: { referencePanel: 'Graph', direction: 'below' },
      })
    },
  }

  useEffect(() => {
    if (!api) return

    const windowBarSubscriptions = Object.entries(windowBarMap).map(
      ([event, handler]) => {
        return subscribe(event, handler)
      }
    )

    api.onDidLayoutChange(() => {
      const layout = api.toJSON()

      saveLayoutToLocalStorage(spellId, layout)
    })

    return () => {
      windowBarSubscriptions.forEach(unsubscribe => {
        unsubscribe()
      })
    }
  }, [api])

  const onDidDrop = (event: DockviewDropEvent) => {
    const component = event.nativeEvent.dataTransfer?.getData('component') || ''
    const title = event.nativeEvent.dataTransfer?.getData('title') || ''
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
        spellId,
        spellName,
      },
    })
  }

  const showDndOverlay = () => {
    return true
  }

  if (!components) return null

  return (
    <>
      <EventHandler tab={tab} pubSub={pubSub} spellId={spellId} />
      <DockviewReact
        onDidDrop={onDidDrop}
        components={components}
        tabComponents={tabComponents}
        onReady={onReady}
        className={theme}
        showDndOverlay={showDndOverlay}
      />
    </>
  )
}
