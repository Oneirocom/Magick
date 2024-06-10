import { useUser } from '@clerk/nextjs'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@magickml/client-ui'
import { usePubSub } from '@magickml/providers'
import { SmartToyOutlined } from '@mui/icons-material'
import { RootState, useGetSpellQuery, useSelectAgentsState } from 'client/state'

import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { CgProfile } from 'react-icons/cg'
import { useSelector } from 'react-redux'

interface Option {
  label: string
  onClick: () => void
}

interface TopBarProps {
  options?: Option[]
}

const TopBar: React.FC<TopBarProps> = ({ options }) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  const { isSignedIn, user } = useUser()
  const globalConfig = useSelector((state: RootState) => state.globalConfig)
  const { lastItem: lastStateEvent } = useSelectAgentsState()

  const { projectId, currentAgentId } = globalConfig || {}
  const { publish, events } = usePubSub()

  const { data: spell } = useGetSpellQuery(currentAgentId)

  const hasWizardSub = user?.publicMetadata.subscription === 'WIZARD'

  useEffect(() => {
    if (!spell || !lastStateEvent || lastStateEvent.spellId !== spell.id) return
    if (!lastStateEvent.state) return

    // Process only spell state events here
    setIsRunning(lastStateEvent.state.isRunning)
  }, [lastStateEvent, spell])

  const toggleMenu = (menuId: string) => {
    setOpenMenu(openMenu === menuId ? null : menuId)
  }

  const toggleRun = () => {
    if (isRunning) {
      // TODO: Change this to a global command to pause all agents
      publish(events.SEND_COMMAND, {
        projectId,
        agentId: currentAgentId,
        command: 'agent:spellbook:pauseSpell',
        data: {
          spellId: spell.id,
        },
      })
      publish(events.RESET_NODE_STATE)
    } else {
      publish(events.SEND_COMMAND, {
        projectId,
        agentId: currentAgentId,
        command: 'agent:spellbook:playSpell',
        data: {
          spellId: spell.id,
        },
      })
    }
    setIsRunning(!isRunning)
  }

  return (
    <div className="bg-gray-800 text-white py-4 px-6 flex items-center justify-between w-full relative">
      <div className="flex items-center space-x-4">
        <div className="text-xl font-bold">
          {isSignedIn && user.hasImage ? (
            <Avatar
              className={clsx(
                'self-center border border-ds-primary h-6 w-6 lg:w-8 lg:h-8 color-transition'
              )}
            >
              <AvatarImage
                className="object-cover w-full h-full rounded-full"
                src={user.imageUrl}
                alt={user.username ?? 'User'}
              />
              <AvatarFallback>{user.username?.charAt(0)}</AvatarFallback>
            </Avatar>
          ) : (
            <CgProfile
              className="text-black dark:text-[#e9edf1]  h-6 w-6 lg:w-8 lg:h-8 color-transition"
              width={32}
              height={32}
              color="currentColor"
            />
          )}
        </div>
        <DropdownMenu
          open={openMenu === 'AgentMenu'}
          onOpenChange={(isOpen: boolean) => {
            if (!isOpen) {
              setOpenMenu(null)
            }
          }}
        >
          <DropdownMenuTrigger onClick={() => toggleMenu('AgentMenu')}>
            <SmartToyOutlined />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[300px] border-[--dark-1] border-2 mt-3 bg-[--ds-card-alt]">
            {/* Add your agent list items here */}
            <div className="flex items-center space-x-2 w-full p-3 bg-gray-800 rounded-lg">
              My Agents
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu
          open={openMenu === 'SubscriptionMenu'}
          onOpenChange={(isOpen: boolean) => {
            if (!isOpen) {
              setOpenMenu(null)
            }
          }}
        >
          <DropdownMenuTrigger onClick={() => toggleMenu('SubscriptionMenu')}>
            {}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[300px] border-[--dark-1] border-2 mt-3 bg-[--ds-card-alt]">
            {/* Add your subscription menu items here */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <Button
          onClick={toggleRun}
          className="bg-[#fe980a] hover:bg-[#f9b454] text-white font-bold py-2 px-4 rounded"
        >
          {isRunning ? 'Stop' : 'Run'}
        </Button>
      </div>
      <div className="flex space-x-4">
        {options &&
          options.map((option, index) => (
            <Button
              key={index}
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
              onClick={option.onClick}
            >
              {option.label}
            </Button>
          ))}
      </div>
    </div>
  )
}

export default TopBar
