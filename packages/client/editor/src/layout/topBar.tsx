'use client'

import { Button } from '@magickml/client-ui'
import {
  //  useFeathers,
  usePubSub,
} from '@magickml/providers'
// import { RootState, useSelectAgentsState } from 'client/state'

import React, { useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
import ViewSidebarOutlinedIcon from '@mui/icons-material/ViewSidebarOutlined'
export interface TopBarProps {
  rightTopBarItems?: React.ReactNode[]
  leftTopBarItems?: React.ReactNode[]
}

const TopBar: React.FC<TopBarProps> = ({
  rightTopBarItems,
  leftTopBarItems,
}) => {
  const [isRunning, setIsRunning] = useState(false)
  // const globalConfig = useSelector((state: RootState) => state.globalConfig)

  const { publish, events } = usePubSub()
  // const dispatch = useDispatch()
  // const { client } = useFeathers()

  // const { lastItem: lastStateEvent } = useSelectAgentsState()

  const toggleFileDrawer = () => {
    publish(events.TOGGLE_FILE_DRAWER)
  }

  const toggleRun = () => {
    if (isRunning) {
      //   // TODO: Change this to a global command to pause all agents
      //   publish(events.SEND_COMMAND, {
      //     projectId,
      //     agentId: currentAgentId,
      //     command: 'agent:spellbook:pauseSpell',
      //     data: {
      //       spellId: spell.id,
      //     },
      //   })
      //   publish(events.RESET_NODE_STATE)
      // } else {
      //   publish(events.SEND_COMMAND, {
      //     projectId,
      //     agentId: currentAgentId,
      //     command: 'agent:spellbook:playSpell',
      //     data: {
      //       spellId: spell.id,
      //     },
      //   })
    }
    setIsRunning(!isRunning)
  }

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
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <Button
          onClick={toggleRun}
          className={`${
            isRunning
              ? 'bg-[#363d42] hover:bg-[#565c62]'
              : 'bg-[#fe980a] hover:bg-[#f9b454]'
          }text-white font-bold py-2 px-4 rounded h-[30px]`}
        >
          {isRunning ? 'Stop' : 'Run'}
        </Button>
      </div>
      <div className="flex items-center space-x-2">
        {rightTopBarItems?.map((item, index) => (
          <>{item}</>
        ))}
      </div>
    </div>
  )
}

export default TopBar
