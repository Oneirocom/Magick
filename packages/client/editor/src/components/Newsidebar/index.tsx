// DOCUMENTED
import Divider from '@mui/material/Divider'
import { useEffect, useState } from 'react'
import { useTreeData } from '@magickml/providers'
import { useSelector } from 'react-redux'
import { useConfig } from '@magickml/providers'
import { AgentMenu } from './AgentMenu'
import { ScreenLinkItems } from './ScreenLinkItems'
import { FileTree } from './FileTree'
import { ContextMenu } from './ContextMenu'
import behaveGraph from '../../graphs/graph.json'
import {
  RootState,
  useCreateAgentMutation,
  useCreateAgentReleaseMutation,
  useGetAgentsQuery,
  useGetUserQuery,
  useNewSpellMutation,
} from 'client/state'
import { useModal } from '../../contexts/ModalProvider'
import { v4 as uuidv4 } from 'uuid'
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
} from 'unique-names-generator'
import { DrawerProps } from '@mui/material/Drawer'

import { MPBalanceBar } from './MPBalanceBar'
import { Button } from '@magickml/client-ui'

/**
 * The main Drawer component that wraps around the application content.
 */
export function NewSidebar(DrawerProps): React.JSX.Element {
  const [isAPIKeysSet, setAPIKeysSet] = useState(false)
  // State to keep track of the anchor element of the menu and cursor position

  const { openModal } = useModal()
  const [data, setData] = useState([])
  const { setAgentUpdate } = useTreeData()

  const config = useConfig()
  const [createNewAgent, { data: newAgent, isLoading }] =
    useCreateAgentMutation()
  const [createAgentRelease] = useCreateAgentReleaseMutation()
  const { data: agents } = useGetAgentsQuery({ projectId: config.projectId })
  const [newSpell] = useNewSpellMutation()
  const { currentTab } = useSelector((state: any) => state.tabLayout)
  const { currentSpellReleaseId } = useSelector<
    RootState,
    RootState['globalConfig']
  >(state => state.globalConfig)

  const { data: userData } = useGetUserQuery({
    projectId: config.projectId,
  })

  // stopgap until I patch the agent menu with new redux stuff
  useEffect(() => {
    if (!newAgent) return
    setAgentUpdate(true)
  }, [newAgent])

  useEffect(() => {
    const handleInitialAgentSetup = async () => {
      try {
        if (!agents || isLoading) return
        // If there are no agents, create a draft agent and a live agent
        if (agents.total === 0) {
          const agentName = uniqueNamesGenerator({
            dictionaries: [adjectives, colors],
            separator: ' ',
            length: 2,
          })

          const newSpellName = uniqueNamesGenerator({
            dictionaries: [adjectives, colors],
            separator: ' ',
            length: 2,
          })

          await newSpell({
            id: uuidv4(),
            graph: behaveGraph,
            name: newSpellName,
            type: 'behave',
            projectId: config.projectId,
          })

          // Create a draft agent
          const draftAgent = await createNewAgent({
            name: agentName,
            projectId: config.projectId,
            enabled: true,
            default: true,
            version: '2.0',
            publicVariables: '{}',
            secrets: '{}',
            updatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            isDraft: true,
          }).unwrap()

          // Create a live agent
          const newLiveAgent = await createNewAgent({
            name: agentName,
            projectId: config.projectId,
            enabled: true,
            default: false,
            version: '2.0',
            publicVariables: '{}',
            secrets: '{}',
            updatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          }).unwrap()

          // Create a release for the live agent
          await createAgentRelease({
            agentId: newLiveAgent.id,
            description: 'Initial Release',
            agentToCopyId: draftAgent.id,
            projectId: config.projectId,
          }).unwrap()

          openModal({
            modal: 'draftAgentCreatedModal',
          })
        } else {
          // // In this scenario, we are assuming a project with one agent is currently live,
          // // Thus a draft should be created and a release should be made for the agent.
          if (agents.total === 1) {
            // Create a draft agent
            const draftAgent = agents.data.filter(agent => agent.isDraft)[0]
            const agent = agents.data.filter(
              agent => agent.id !== draftAgent?.id
            )[0]

            if (draftAgent) {
              // Create a live agent
              await createNewAgent({
                name: draftAgent.name,
                projectId: config.projectId,
                enabled: true,
                default: false,
                version: '2.0',
                publicVariables: '{}',
                secrets: '{}',
                updatedAt: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                isDraft: false,
              }).unwrap()
              //TOOD: open a modal for published agent created
              return
            }

            if (!agent) throw new Error('No agent found during setup')

            const newDraftAgent = await createNewAgent({
              publicVariables: '{}',
              secrets: '{}',
              name: agent.name,
              enabled: true,
              pingedAt: '',
              projectId: agent.projectId,
              data: agent.data || {},
              runState: newAgent?.runState,
              image: agent.image || '',
              default: true,
              currentSpellReleaseId: null,
              isDraft: true,
            }).unwrap()

            // Create a release for the live agent
            await createAgentRelease({
              agentId: newDraftAgent.id,
              description: 'Initial Release',
              agentToCopyId: agent.id,
            }).unwrap()

            openModal({
              modal: 'draftAgentCreatedModal',
            })
          }
        }
      } catch (error: any) {
        console.log(`Error in initial agent setup: ${error}`)
      }
    }
    handleInitialAgentSetup()
    if (agents?.data === data) return
    setData(agents?.data)
  }, [agents, createNewAgent, createAgentRelease, config.projectId])

  useEffect(() => {
    const secrets = localStorage.getItem('secrets')
    if (secrets) {
      let secretHasBeenSet = false
      const parsedSecrets = JSON.parse(secrets)
      Object.keys(parsedSecrets).forEach(key => {
        if (parsedSecrets[key] !== '' && parsedSecrets[key]) {
          secretHasBeenSet = true
        }
      })
      setAPIKeysSet(secretHasBeenSet)
    }
  }, [])

  const onCreateSpell = () => {
    openModal({
      modal: 'createSpellModal',
    })
  }

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
        borderRight: '1px solid var(--deep-background-color)',
      }}
    >
      <AgentMenu data={data} />

      <div className={`${!isAPIKeysSet ? 'flex pb-4' : ''} `}>
        <ScreenLinkItems isAPIKeysSet={isAPIKeysSet} currentTab={currentTab} />
      </div>

      <Divider sx={{ marginY: 2 }} />
      {!currentSpellReleaseId && (
        <div className="px-4">
          <Button
            className="p-4 w-full mb-4 "
            variant="portal-primary"
            onClick={onCreateSpell}
          >
            + Create spell
          </Button>
        </div>
      )}
      <div className="overflow-x-hidden pb-8">
        <FileTree currentTab={currentTab} />

        <ContextMenu />
      </div>

      <MPBalanceBar userData={userData} />
    </div>
  )
}

export const DrawerProvider = ({ children }: DrawerProps) => {
  return <NewSidebar> {children}</NewSidebar>
}
