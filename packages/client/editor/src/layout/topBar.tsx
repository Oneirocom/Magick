'use client'

import { Button } from '@magickml/client-ui'
import { useConfig, usePubSub } from '@magickml/providers'
import React, { useCallback, useEffect, useState } from 'react'
import ViewSidebarOutlinedIcon from '@mui/icons-material/ViewSidebarOutlined'
import { useDispatch, useSelector } from 'react-redux'
import {
  RootState,
  selectEngineRunning,
  setEngineRunning,
  useLazyGetAgentByIdQuery,
  useSelectAgentsState,
} from 'client/state'

import toast from 'react-hot-toast'
import useEditorSession from '../hooks/useEditorSession'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBug, faBugSlash } from '@fortawesome/free-solid-svg-icons'
export interface TopBarProps {
  rightTopBarItems?: React.ReactNode[]
  leftTopBarItems?: React.ReactNode[]
}

const TopBar: React.FC<TopBarProps> = ({
  rightTopBarItems,
  leftTopBarItems,
}) => {
  const engineRunning = useSelector(selectEngineRunning)
  const editorSession = useEditorSession()
  const config = useConfig()

  const { currentAgentId } = useSelector<RootState>(
    state => state.globalConfig
  ) as any

  const { lastItem: lastStateEvent } = useSelectAgentsState()
  const { currentTab } = useSelector((state: RootState) => state.tabLayout)

  const [getAgentById, { data: agent, isLoading, isError }] =
    useLazyGetAgentByIdQuery()

  const [isDebug, setIsDebug] = useState(false)

  const { publish, events } = usePubSub()
  const dispatch = useDispatch()

  useEffect(() => {
    if (currentAgentId) {
      getAgentById({ agentId: currentAgentId })
    }
  }, [currentAgentId])

  useEffect(() => {
    if (isError) {
      toast.error('Error fetching agent')
    }
  }, [isError])

  useEffect(() => {
    if (!currentTab?.id || !lastStateEvent) return
    if (lastStateEvent.spellId !== currentTab.id) return
    if (!lastStateEvent.state) return

    setIsDebug(lastStateEvent.state.debug)
  }, [lastStateEvent])

  const toggleFileDrawer = () => {
    publish(events.TOGGLE_FILE_DRAWER)
  }

  const toggleRightPanel = () => {
    publish(events.TOGGLE_RIGHT_PANEL)
  }

  const toggleRun = () => {
    if (!currentAgentId) return

    const eventPayload = {
      content: '',
      connector: 'editor',
      eventName: 'agent:spellbook:startEngineEvent',
      status: 'unknown',
      sender: 'user',
      observer: 'assistant',
      client: 'editor',
      plugin: 'core',
      skipSave: true,
      projectId: config.projectId,
      channel: editorSession,
      channelType: 'spell playtest',
      rawData: '',
      timestamp: new Date().toISOString(),
      agentId: currentAgentId,
      metadata: {},
      isPlaytest: true,
      data: {},
    }

    if (engineRunning) {
      publish(events.SEND_COMMAND, {
        command: 'agent:spellbook:stopEngineEvent',
        agentId: currentAgentId,
        data: eventPayload,
      })
      dispatch(setEngineRunning(false))
      publish(events.RESET_NODE_STATE)
    } else {
      publish(events.SEND_COMMAND, {
        command: 'agent:spellbook:startEngineEvent',
        agentId: currentAgentId,
        data: eventPayload,
      })
      dispatch(setEngineRunning(true))
    }
  }

  const toggleDebug = useCallback(() => {
    console.log({ publish, events, currentAgentId, agentId: currentTab?.id })
    if (!publish || !events || !currentAgentId || !currentTab?.id) return
    const newState = !isDebug
    console.log('toggleDebug', newState)
    publish(events.SEND_COMMAND, {
      projectId: config.projectId,
      agentId: currentAgentId,
      command: 'agent:spellbook:toggleDebug',
      data: {
        spellId: currentTab?.id,
        debug: newState,
      },
    })

    setIsDebug(newState)
  }, [isDebug, publish, events, currentAgentId, currentTab?.id])

  if (isLoading || !agent) return null
  const isDraftAgent = agent.isDraft

  return (
    <div className="bg-gray-800 text-white py-4 px-2 flex items-center justify-between w-full relative h-12 border-b-2 border-[--background-color]">
      <div className="flex items-center space-x-2">
        <Button
          onClick={toggleFileDrawer}
          className="text-white font-bold py-2 px-2 rounded bg-transparent"
        >
          <ViewSidebarOutlinedIcon className="transform scale-x-[-1] hover:text-[#06c9f0] transition duration-300" />
        </Button>

        {leftTopBarItems?.map((item, index) => (
          <>{item}</>
        ))}
      </div>
      {isDraftAgent && (
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Button
            onClick={toggleRun}
            className={`${
              engineRunning
                ? 'bg-[#363d42] hover:bg-[#565c62]'
                : 'bg-[#fe980a] hover:bg-[#f9b454]'
            } text-white font-bold py-2 px-4 rounded h-[30px]`}
          >
            {engineRunning ? 'Stop' : 'Run'}
          </Button>
          <Button
            onClick={toggleDebug}
            className="text-white font-bold py-2 px-4 rounded bg-transparent"
          >
            <FontAwesomeIcon icon={isDebug ? faBug : faBugSlash} />
          </Button>
        </div>
      )}
      <div className="flex items-center space-x-2">
        {rightTopBarItems?.map((item, index) => (
          <>{item}</>
        ))}
        <div className="flex items-center space-x-2 p-1 rounded-md">
          <Button
            className="text-white font-bold rounded px-1 bg-transparent w-[28px] h-[28px]"
            onClick={toggleRightPanel}
          >
            <ViewSidebarOutlinedIcon className="hover:text-[#06c9f0] transition duration-300" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default TopBar
