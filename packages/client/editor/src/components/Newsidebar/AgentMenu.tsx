// @ts-nocheck
import posthog from 'posthog-js'
import { useState, useCallback, useEffect } from 'react'
import clsx from 'clsx'
import { useDispatch } from 'react-redux'
import { STANDALONE } from 'clientConfig'
import { useFeathers } from '@magickml/providers'
import {
  setCurrentAgentId,
  setCurrentSpellReleaseId,
  useCreateAgentReleaseMutation,
} from 'client/state'
import { useModal } from '../../contexts/ModalProvider'
import AgentListItem from '../../screens/agents/AgentWindow/AgentListItem'
import { useSnackbar } from 'notistack'
import { AgentInterface } from '@magickml/agent-server-schemas'
import {
  Button,
  DropdownMenu,
  Avatar,
  AvatarImage,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@magickml/client-ui'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import { defaultImage } from '@magickml/utils'

export function AgentMenu({ data }) {
  const { client } = useFeathers()
  const dispatch = useDispatch()
  const { openModal, closeModal } = useModal()
  const { enqueueSnackbar } = useSnackbar()

  const [openMenu, setOpenMenu] = useState(null)
  const [currentAgent, _setCurrentAgent] = useState<AgentInterface | null>(null)
  const [draftAgent, setDraftAgent] = useState(null)
  const [publishedAgent, setPublishedAgent] = useState(null)

  const [createAgentRelease] = useCreateAgentReleaseMutation()

  const setCurrentAgent = useCallback((agent: AgentInterface) => {
    if (!agent) {
      console.error('AGENT IS NULL IN AGENT MENU')
      return
    }

    console.log('CREATING AGENT IN AGENT MENU')

    // onlt create agent if it is enabled
    if (agent?.enabled) {
      client.service('agents').createAgent(agent.id)
    }

    client.service('agents').subscribe(agent.id)
    _setCurrentAgent(agent)
    // store this current agent in the global state for use in the editor
    dispatch(setCurrentAgentId(agent.id))
    dispatch(setCurrentSpellReleaseId(agent?.currentSpellReleaseId))
  }, [])

  // Update draftAgent and publishedAgent when data changes
  useEffect(() => {
    const handleDataUpdate = async () => {
      if (!data) return

      const draft = data.find(agent => agent.isDraft)
      const published = data.find(agent => agent.currentSpellReleaseId)

      setDraftAgent(draft)
      setCurrentAgent(draft)
      if (published) setPublishedAgent(published)
    }

    handleDataUpdate()
  }, [data])

  const toggleMenu = (target = null) => {
    if (openMenu) {
      // Menu is currently open, so close it
      setOpenMenu(null)
    } else {
      // Menu is currently closed, so open it at the specified target
      setOpenMenu(target)
    }
  }

  const handleSelectAgent = (agent: AgentInterface) => {
    setCurrentAgent(agent)
    toggleMenu()
  }

  const redirectToCloudAgents = () => {
    if (STANDALONE) {
      window.parent.postMessage({ type: 'redirect', href: '/agents' }, '*')
    }
  }

  const confirmPublish = async onConfirm => {
    toggleMenu()
    closeModal()
    openModal({
      modal: 'confirmationModal',
      title: 'Publish to agent',
      confirmButtonText: 'Publish',
      cancelButtonText: 'Cancel',
      onConfirm,
    })
  }

  const publishToLiveAgent = async (description: string) => {
    try {
      if (publishedAgent) {
        const result = await createAgentRelease({
          agentId: publishedAgent.id,
          description,
          agentToCopyId: draftAgent.id,
          projectId: publishedAgent.projectId,
        }).unwrap()
        if (result) {
          enqueueSnackbar('Successfully published to live agent', {
            variant: 'success',
          })

          posthog.capture('agent_published', {
            projectId: publishedAgent.projectId,
            agentId: publishedAgent.id,
            agentName: publishedAgent.name,
            agentReleaseId: result.id,
          })
        }
      }
    } catch (error) {
      enqueueSnackbar('Error publishing to live agent!', { variant: 'error' })
    }
  }

  const handleMakeRelease = async () => {
    if (publishedAgent && draftAgent) {
      // Check if there is a published agent
      confirmPublish(publishToLiveAgent)
    }
  }

  return (
    <div className="flex items-center justify-between w-full p-3 bg-gray-800 rounded-lg ">
      <div
        className="flex items-center space-x-2 w-full"
        onClick={redirectToCloudAgents}
      >
        <Avatar
          className={clsx(
            'border border-ds-primary w-8 h-8 justify-center items-center mr-3'
          )}
        >
          <AvatarImage
            className="object-cover w-full h-full rounded-full"
            src={
              publishedAgent?.image
                ? `${process.env.NEXT_PUBLIC_BUCKET_PREFIX}/${publishedAgent?.image}`
                : defaultImage(currentAgent?.id || '1')
            }
            alt={currentAgent?.name?.at(0) || 'A'}
          />
          {currentAgent?.image ? currentAgent?.name.at(0) || 'A' : null}
        </Avatar>
        <div className="flex flex-col w-full">
          <span className="text-white font-medium">{currentAgent?.name}</span>
          <span className="text-xs text-gray-400">
            {currentAgent?.isDraft ? 'Draft' : 'Live'}
          </span>
        </div>
      </div>

      <div
        onClick={event => toggleMenu(event.currentTarget)}
        className="text-white p-2 bg-gray-700 rounded-full hover:bg-[#282d33] cursor-pointer transition-all"
      >
        <ChevronDownIcon className="h-4 w-4 m-1" />
      </div>

      <DropdownMenu
        id="AgentMenu"
        open={!!openMenu}
        onOpenChange={isOpen => {
          if (!isOpen) {
            setOpenMenu(null)
            toggleMenu()
          }
        }}
      >
        <DropdownMenuTrigger
          onClick={() => {
            toggleMenu()
          }}
        />
        <DropdownMenuContent
          className="w-[300px] border-[--dark-1] border-2 mt-3 bg-[--ds-card-alt]"
          style={{ marginLeft: '-200px' }}
        >
          <h3 className="mt-3 mb-2 ml-3">Draft</h3>
          {draftAgent && (
            <AgentListItem
              key={draftAgent.id}
              agent={{ ...draftAgent, image: publishedAgent?.image || null }}
              onSelectAgent={handleSelectAgent}
              isDraft
            />
          )}
          {publishedAgent && (
            <div>
              <DropdownMenuSeparator className="border-2 border-[--dark-1]" />
              <h3 className="mt-3 mb-2 ml-3">Live Agent</h3>
              <AgentListItem
                key={publishedAgent.id}
                agent={publishedAgent}
                selectedAgents={publishedAgent}
                onSelectAgent={handleSelectAgent}
                onCheckboxChange={() => {}}
                isSinglePublishedAgent={true}
              />
            </div>
          )}

          <DropdownMenuSeparator className="border-2 border-[--dark-1]" />

          <div className="flex flex-col items-center justify-between w-full py-0 px-2 bg-[--ds-card-alt]">
            <Button
              className="w-full mt-4 mb-4 text-black hover:bg-[#70e5ff] transition-all"
              onClick={() => {
                void handleMakeRelease()
              }}
            >
              Publish to Live Agent
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
