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
import { useCreateAgentMutation, useCreateAgentReleaseMutation, useGetAgentsQuery } from 'client/state'
import { useModal } from '../../contexts/ModalProvider'

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
  const [createNewAgent, { data: newAgent }] = useCreateAgentMutation()
  const [createAgentRelease] = useCreateAgentReleaseMutation()
  const { data: agents } = useGetAgentsQuery({ projectId: config.projectId, })

  const { currentTab } = useSelector((state: any) => state.tabLayout)

  // stopgap until I patch the agent menu with new redux stuff
  useEffect(() => {
    if (!newAgent) return
    setAgentUpdate(true)
  }, [newAgent])


  useEffect(() => {
    const handleInitialAgentSetup = async () => {
      // If there are no agents, create a draft agent and a live agent
      if (agents && agents.total === 0) {
        // Create a draft agent
        await createNewAgent({
          name: 'Draft Agent',
          projectId: config.projectId,
          enabled: false,
          default: true,
          publicVariables: '{}',
          secrets: '{}',
        }).unwrap();

        // Create a live agent
        const newLiveAgent = await createNewAgent({
          name: 'My Live Agent',
          projectId: config.projectId,
          enabled: true,
          default: false,
          publicVariables: '{}',
          secrets: '{}',
        }).unwrap();

        // Create a release for the live agent
        await createAgentRelease({
          agentId: newLiveAgent.id,
          description: 'Initial release'
        }).unwrap();
      }

      // In this scenario, we are assuming a project with one agent is currently live,
      // Thus a draft should be created and a release should be made for the agent.
      if (agents && agents.total === 1) {
        // Create a draft agent
        const agent = agents.data[0]
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
          rootSpellId: agent?.rootSpellId || "",
          default: true,
          currentSpellReleaseId: null,
        }).unwrap();

        // Create a release for the live agent
        await createAgentRelease({
          agentId: agents[0].id,
          description: 'Initial release'
        }).unwrap();
      }
    }
    handleInitialAgentSetup();
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
