'use client'

import ViewSidebarOutlinedIcon from '@mui/icons-material/ViewSidebarOutlined'
import React, { useEffect } from 'react'
import { useConfig, usePubSub } from '@magickml/providers'
import useEditorSession from '../hooks/useEditorSession'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@magickml/client-ui'
import { enqueueSnackbar } from 'notistack'
import toast from 'react-hot-toast'
import posthog from 'posthog-js'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@magickml/client-ui'
import {
  useLazyGetAgentByIdQuery,
  selectEngineRunning,
  setEngineRunning,
  RootState,
} from 'client/state'

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

  const [getAgentById, { data: agent, isLoading, isError }] =
    useLazyGetAgentByIdQuery()

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

  const onKill = () => {
    publish(events.SEND_COMMAND, {
      command: 'agent:spellbook:killSpells',
    })

    publish(events.RESET_NODE_STATE)

    posthog.capture('kill_all_spells', {
      agentId: currentAgentId,
    })

    enqueueSnackbar('All spells stopped.  Send an event to start them again.', {
      variant: 'success',
    })
  }

  const onRefresh = () => {
    publish(events.SEND_COMMAND, {
      command: 'agent:spellbook:refreshSpells',
    })

    publish(events.RESET_NODE_STATE)

    posthog.capture('refresh_all_spells', {
      agentId: currentAgentId,
    })

    enqueueSnackbar('All spells refreshed.', {
      variant: 'success',
    })
  }

  if (isLoading || !agent) return null
  const isDraftAgent = agent.isDraft

  return (
    <TooltipProvider>
      <div className="bg-[#040405] text-white py-4 px-2 flex items-center justify-between w-full relative h-12 border-b-2 border-[--background-color]">
        <div className="flex items-center space-x-2">
          <Button
            onClick={toggleFileDrawer}
            className="text-white font-bold py-2 px-2 rounded bg-transparent"
          >
            <ViewSidebarOutlinedIcon className="transform scale-x-[-1] hover:text-[#06c9f0] transition duration-300" />
          </Button>

          {leftTopBarItems?.map((item, index) => (
            <React.Fragment key={index}>{item}</React.Fragment>
          ))}
        </div>
        <div className="flex items-center space-x-4 absolute left-1/2 transform -translate-x-1/2 z-50">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="h-6"
                variant="secondary"
                size="sm"
                onClick={onRefresh}
              >
                Reset
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={8} className="z-50">
              Refresh the application
            </TooltipContent>
          </Tooltip>
          {isDraftAgent && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={toggleRun}
                  className={`${
                    engineRunning
                      ? 'bg-[#363d42] hover:bg-[#565c62]'
                      : 'bg-[#fe980a] hover:bg-[#d7820b]'
                  } text-white font-bold py-2 px-4 rounded h-[30px]`}
                >
                  {engineRunning ? 'Stop' : 'Run'}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={8} className="z-50">
                {engineRunning ? 'Stop the engine' : 'Start the engine'}
              </TooltipContent>
            </Tooltip>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="h-6"
                variant="destructive"
                size="sm"
                onClick={onKill}
              >
                Kill
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={8} className="z-50">
              Kill all spells
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex items-center space-x-2">
          {rightTopBarItems?.map((item, index) => (
            <React.Fragment key={index}>{item}</React.Fragment>
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
    </TooltipProvider>
  )
}

export default TopBar
