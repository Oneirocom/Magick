// DOCUMENTED
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import { useEffect, useState } from 'react'
import { useTreeData } from '@magickml/providers'
import { Typography } from '@mui/material'
import LinearProgress, {
  linearProgressClasses,
} from '@mui/material/LinearProgress'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { useSelector } from 'react-redux'

import { useConfig } from '@magickml/providers'

import { AgentMenu } from './AgentMenu'
import styles from './menu.module.css'

import { ScreenLinkItems } from './ScreenLinkItems'
import { FileTree } from './FileTree'
import { ContextMenu } from './ContextMenu'
import {
  useCreateAgentMutation,
  useCreateAgentReleaseMutation,
  useGetAgentsQuery,
  useNewSpellMutation
} from 'client/state'
import { useModal } from '../../contexts/ModalProvider'
import { v4 as uuidv4 } from 'uuid';
import md5 from 'md5';
import { uniqueNamesGenerator, adjectives, colors } from 'unique-names-generator';
import { getTemplates } from 'client/core'

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 7,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: '#1BC5EB',
  },
}))

type DrawerProps = {
  children: React.ReactNode
}

/**
 * The main Drawer component that wraps around the application content.
 */
export function NewSidebar(DrawerProps): JSX.Element {
  const [isAPIKeysSet, setAPIKeysSet] = useState(false)
  // State to keep track of the anchor element of the menu and cursor position

  const { openModal } = useModal()
  const [data, setData] = useState([])
  const { setAgentUpdate } = useTreeData()

  const config = useConfig()
  const [createNewAgent, { data: newAgent, isLoading }] = useCreateAgentMutation()
  const [createAgentRelease] = useCreateAgentReleaseMutation()
  const { data: agents } = useGetAgentsQuery({ projectId: config.projectId, })
  const [newSpell] = useNewSpellMutation()
  const { currentTab } = useSelector((state: any) => state.tabLayout)

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
          const agent = agents.data[0]
          let rootSpellId = agent?.rootSpellId

          if (!rootSpellId) {
            const spellTemplate = getTemplates().spells[0] as any
            const spellName = uniqueNamesGenerator({
              dictionaries: [adjectives, colors],
              separator: ' ',
              length: 2,
            })
            const rootSpell = (await newSpell({
              id: uuidv4(),
              graph: spellTemplate.graph,
              name: spellName,
              type: spellTemplate.type || "spell",
              projectId: config.projectId,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              hash: md5(JSON.stringify(spellTemplate?.graph.nodes)),
            })) as any

            rootSpellId = rootSpell.data.id
          }

          // Create a draft agent
          const draftAgent = await createNewAgent({
            name: 'Draft Agent',
            projectId: config.projectId,
            enabled: false,
            default: true,
            publicVariables: '{}',
            secrets: '{}',
            rootSpellId: rootSpellId || "",
            updatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          }).unwrap();

          // Create a live agent
          const newLiveAgent = await createNewAgent({
            name: 'My Live Agent',
            projectId: config.projectId,
            enabled: true,
            default: false,
            publicVariables: '{}',
            secrets: '{}',
            rootSpellId: rootSpellId || "",
            updatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          }).unwrap();

          // Create a release for the live agent
          await createAgentRelease({
            agentId: newLiveAgent.id,
            description: 'Initial Release',
            agentToCopyId: draftAgent.id,
            projectId: config.projectId,
          }).unwrap();

          openModal({
            modal: 'draftAgentCreatedModal',
          })
        } else {

          // // In this scenario, we are assuming a project with one agent is currently live,
          // // Thus a draft should be created and a release should be made for the agent.
          if (agents.total === 1) {
            // Create a draft agent
            const draftAgent = agents.data.filter(agent => agent.name === 'Draft Agent')[0]
            const agent = agents.data.filter(agent => agent.id !== draftAgent?.id)[0]

            if (!draftAgent) {
              let rootSpellId = agent?.rootSpellId
              if (!rootSpellId) {
                const spellTemplate = getTemplates().spells[0] as any

                const spellName = uniqueNamesGenerator({
                  dictionaries: [adjectives, colors],
                  separator: ' ',
                  length: 2,
                })

                const rootSpell = (await newSpell({
                  id: uuidv4(),
                  graph: spellTemplate.graph,
                  name: spellName,
                  type: spellTemplate.type || "spell",
                  projectId: config.projectId,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  hash: md5(JSON.stringify(spellTemplate?.graph.nodes)),
                })) as any

                rootSpellId = rootSpell.data.id
              }

              await createNewAgent({
                rootSpell: agent?.rootSpell || "{}", // Depricated
                publicVariables: '{}',
                secrets: '{}',
                name: 'Draft Agent',
                enabled: false,
                pingedAt: "",
                projectId: agent?.projectId,
                data: agent?.data || {},
                runState: newAgent?.runState,
                image: agent?.image || "",
                rootSpellId: rootSpellId || "",
                default: true,
                currentSpellReleaseId: null,
              }).unwrap()
            }

            // Create a release for the live agent
            await createAgentRelease({
              agentId: agent.id,
              description: 'Initial Release',
              agentToCopyId: agent.id,
              projectId: agent.projectId,
            }).unwrap();

            openModal({
              modal: 'draftAgentCreatedModal',
            })
          }
        }
      } catch (error: any) {
        console.log(`Error in initial agent setup: ${error}`)
      }
    }
    handleInitialAgentSetup();
    if (agents?.data === data) return;
    setData(agents?.data);
  }, [agents, createNewAgent, createAgentRelease, config.projectId]);



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
    <div style={{ display: 'flex', height: '100%', flexDirection: 'column', borderRight: '1px solid var(--deep-background-color)' }}>
      <AgentMenu data={data} />

      <div className={`${!isAPIKeysSet ? "flex pb-4" : ""}`}>
        <ScreenLinkItems isAPIKeysSet={isAPIKeysSet} currentTab={currentTab} />
      </div>

      <Divider sx={{ marginY: 2 }} />
      <div className="px-4">
        <button onClick={onCreateSpell} className="p-4 w-full mb-4 cursor-pointer">+ Create spell</button>

      </div>
      <div className="overflow-y-scroll overflow-x-hidden pb-8">
        <FileTree currentTab={currentTab} />

        <ContextMenu />
      </div>

      <div className={styles.credits}>
        <div className={styles.menuFlex}>
          <AutoAwesomeIcon sx={{ mr: 1 }} />
          <Typography variant="body1">MP</Typography>
        </div>
        <BorderLinearProgress variant="determinate" value={100} />
        <p className={styles.creditCount}><span style={{ fontSize: '2rem', position: 'relative', top: 3 }}>&#8734;</span> monthly MP</p>
      </div>
    </div>
  )
}

export const DrawerProvider = ({ children }: DrawerProps) => {
  return <NewSidebar> {children}</NewSidebar>
}
