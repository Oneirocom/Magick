'use client'

import { Button } from '@magickml/client-ui'
import { usePubSub } from '@magickml/providers'
import React, { useState } from 'react'
import ViewSidebarOutlinedIcon from '@mui/icons-material/ViewSidebarOutlined'
export interface TopBarProps {
  rightTopBarItems?: React.ReactNode[]
  leftTopBarItems?: React.ReactNode[]
  agentId: string
}

const TopBar: React.FC<TopBarProps> = ({
  rightTopBarItems,
  leftTopBarItems,
  agentId,
}) => {
  const [isRunning, setIsRunning] = useState(false)

  const { publish, events } = usePubSub()

  const toggleFileDrawer = () => {
    publish(events.TOGGLE_FILE_DRAWER)
  }

  const toggleRightPanel = () => {
    publish(events.TOGGLE_RIGHT_PANEL)
  }

  const toggleRun = () => {
    if (!agentId) return
    // toggleRunAll({ agentId, start: !isRunning })
    publish(events.SEND_COMMAND, {
      agentId: agentId,
      command: 'agent:spellbook:toggleRunAll',
      data: {
        agentId,
        start: !isRunning,
      },
    })
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
          } text-white font-bold py-2 px-4 rounded h-[30px]`}
        >
          {isRunning ? 'Stop' : 'Run'}
        </Button>
      </div>
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
