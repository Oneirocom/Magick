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
import { useCreateAgentMutation, useGetAgentsQuery } from 'client/state'
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

  const config = useConfig()
  const { openModal } = useModal()
  const [data, setData] = useState([])
  const { setAgentUpdate } = useTreeData()

  const [createNewAgent, { data: newAgent }] = useCreateAgentMutation()
  const { data: agents } = useGetAgentsQuery({ projectId: config.projectId, })

  const { currentTab } = useSelector((state: any) => state.tabLayout)

  // stopgap until I patch the agent menu with new redux stuff
  useEffect(() => {
    if (!newAgent) return
    setAgentUpdate(true)
  }, [newAgent])

  /**
   * get all agents
   * if there areny any, create one
   * this triggers cache reset on all agents and re-fetches them with the new agent included
   */
  useEffect(() => {
    if (!agents) return

    if (agents.total === 0) {
      createNewAgent({
        name: 'Default Agent',
        projectId: config.projectId,
        enabled: false,
        publicVariables: '{}',
        secrets: '{}',
        default: true,
      })

      return
    }

    // console.log('AGENTS', agents)

    setData(agents.data)

  }, [agents])

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
