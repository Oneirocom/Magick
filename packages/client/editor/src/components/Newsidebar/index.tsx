// DOCUMENTED
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTreeData } from '@magickml/providers'
import { Typography } from '@mui/material'
import LinearProgress, {
  linearProgressClasses,
} from '@mui/material/LinearProgress'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { useSelector } from 'react-redux'

import { useConfig } from '@magickml/providers'
import { DEFAULT_USER_TOKEN, STANDALONE, PRODUCTION } from 'shared/config'

import { AgentMenu } from './AgentMenu'
import styles from './menu.module.css'

import { ScreenLinkItems } from './ScreenLinkItems'
import { FileTree } from './FileTree'
import { ComingSoon } from './ComingSoon'
import { ContextMenu } from './ContextMenu'
import { useCreateAgentMutation, useGetAgentsQuery } from 'client/state'

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
  const [data, setData] = useState([])
  const globalConfig = useSelector((state: any) => state.globalConfig)
  const token = globalConfig?.token
  const { setAgentUpdate } = useTreeData()

  const [createNewAgent, { data: newAgent }] = useCreateAgentMutation()
  const { data: agents, refetch } = useGetAgentsQuery({ projectId: config.projectId, })

  const resetData = async () => {
    refetch()
    setAgentUpdate(true)
  }

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

  // useEffect(() => {
  //   if (!config.apiUrl) return
  //     ; (async () => {
  //       const res = await fetch(
  //         `${config.apiUrl}/agents?projectId=${config.projectId}`,
  //         {
  //           headers: STANDALONE
  //             ? { Authorization: `Bearer ${DEFAULT_USER_TOKEN}` }
  //             : { Authorization: `Bearer ${token}` },
  //         }
  //       )
  //       const json = await res.json()
  //       // if data.length === 0  create new agent
  //       if (json.data.length === 0) {
  //         await createNewAgent({
  //           name: 'Default Agent',
  //           projectId: config.projectId,
  //           enabled: false,
  //           publicVariables: '{}',
  //           secrets: '{}',
  //           default: true,
  //         })
  //         setData(json.data)
  //       } else {
  //         setData(json.data)
  //       }

  //       // setIsLoading(false)
  //     })()
  // }, [config?.apiUrl])


  return (
    <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
      <AgentMenu data={data} resetData={resetData} />

      <ScreenLinkItems isAPIKeysSet={isAPIKeysSet} />
      <Divider sx={{ marginY: 2 }} />
      <FileTree />
      <ComingSoon />

      <ContextMenu />

      <div className={styles.credits}>
        <div className={styles.menuFlex}>
          <AutoAwesomeIcon sx={{ mr: 1 }} />
          <Typography variant="body1">MP</Typography>
        </div>
        <BorderLinearProgress variant="determinate" value={50} />
        <p className={styles.creditCount}>300/500 monthly MP</p>
      </div>
    </div>
  )
}

export const DrawerProvider = ({ children }: DrawerProps) => {
  return <NewSidebar> {children}</NewSidebar>
}
