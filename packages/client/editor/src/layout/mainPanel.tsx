"use client"

import {
  DockviewReact,
  DockviewReadyEvent,
  IDockviewHeaderActionsProps,
  IDockviewPanelProps,
  IDockviewPanelHeaderProps,
  DockviewDefaultTab,
} from 'dockview'
import { useHotkeys } from 'react-hotkeys-hook'
import { useTabLayout } from '@magickml/providers'
import Requests from '../screens/RequestWindow'
import Agents from '../screens/agents/AgentManagerWindow'
import { SecretWindow } from 'windows/secrets'
import ComposerV2 from '../components/workspaces/composerv2'
import NewMenuBar from '../components/MenuBar/newMenuBar'

// import './tab-layout.scss'
import WelcomeScreen from '../components/Watermark/watermark'
import { ConfigWindow } from 'windows/config'
import posthog from 'posthog-js'
import { KnowledgeWindow } from 'window-knowledge'
import { EventsWindow } from 'windows-events'

const TabHeader = (props: IDockviewPanelHeaderProps) => {
  const onContextMenu = (event: React.MouseEvent) => {
    event.preventDefault()
    alert('context menu')
  }

  const onTabClick = (event: React.MouseEvent) => {
    posthog.capture('tab_click', {
      tab: props.containerApi.activePanel?.title,
    })
  }

  // @ts-ignore
  return (
    <DockviewDefaultTab
      onContextMenu={onContextMenu}
      onClick={onTabClick}
      {...props}
    />
  )
}

const tabComponents = {
  tabHeader: TabHeader,
}

const getComponents = () => {
  return {
    Events: () => <EventsWindow />,
    Requests,
    Knowledge: () => <KnowledgeWindow />,
    Agents,
    Config: () => <ConfigWindow />,
    Secrets: () => <SecretWindow />,
    behave: ComposerV2,
    spell: (props: IDockviewPanelProps<{ title: string }>) => {
      return (
        <div
          style={{
            height: '100%',
            padding: '20px',
            background: 'var(--background-color)',
          }}
        >
          <p>'V1 Spells no longer support'</p>
        </div>
      )
    },
    default: (props: IDockviewPanelProps<{ title: string }>) => {
      return (
        <div
          style={{
            height: '100%',
            padding: '20px',
            background: 'var(--background-color)',
          }}
        >
          {JSON.stringify(props.params)}
        </div>
      )
    },
  }
}

const PreControls = (props: IDockviewHeaderActionsProps) => {
  return (
    <div
      className="group-control"
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0px',
        height: '100%',
        color: 'var(--dv-activegroup-visiblepanel-tab-color)',
      }}
    >
      <NewMenuBar />
    </div>
  )
}

const MainPanel = () => {
  const { theme, setApi, getLayout, api } = useTabLayout()

  useHotkeys('ctrl+alt+right', () => {
    if (!api) return
    api.moveToNext({ includePanel: true })
  })

  useHotkeys('ctrl+alt+left', () => {
    if (!api) return
    api.moveToPrevious({ includePanel: true })
  })

  const onReady = (event: DockviewReadyEvent) => {
    const layout = getLayout()

    if (layout) {
      event.api.fromJSON(layout)
    }

    setApi(event.api)
  }

  return (
    <DockviewReact
      onReady={onReady}
      watermarkComponent={WelcomeScreen}
      prefixHeaderActionsComponent={PreControls}
      tabComponents={tabComponents}
      className={`tab-layout ${theme}`}
      components={getComponents()}
    />
  )
}

export default MainPanel
