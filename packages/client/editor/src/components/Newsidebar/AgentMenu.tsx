import { useState, useCallback, useEffect } from 'react'
import { styled } from '@mui/material/styles'
import Avatar from '@mui/material/Avatar'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import { useDispatch } from 'react-redux'
import { STANDALONE, } from 'shared/config'

import { useFeathers } from '@magickml/providers'
import { useTabLayout } from '@magickml/providers'
import { AgentInterface } from 'shared/core'
import { setCurrentAgentId } from 'client/state'

export function AgentMenu({ data }) {

  const { client } = useFeathers()
  const { openTab } = useTabLayout()
  const [openMenu, setOpenMenu] = useState(null)
  const [currentAgent, _setCurrentAgent] = useState<AgentInterface | null>(null)
  const dispatch = useDispatch()

  const setCurrentAgent = useCallback((agent: AgentInterface) => {
    // Subscribe to agent service
    client.service('agents').subscribe(agent.id)
    _setCurrentAgent(agent)

    // store this current agent in the global state for use in the editor
    dispatch(setCurrentAgentId(agent.id))
  }, [])

  const BorderedAvatar = styled(Avatar)`
    border: 1px solid lightseagreen;
    ${STANDALONE && 'cursor: pointer;'}
  `

  const handleToggleMenu1 = event => {
    setOpenMenu(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setOpenMenu(null)
  }


  const StyledDivider = styled(Divider)(({ theme }) => ({
    backgroundColor: 'black',
    marginTop: '4px',
    marginBottom: '4px',
  }))

  const handleSelectAgent = (agent: AgentInterface) => {
    setCurrentAgent(agent)
    handleCloseMenu()
  }

  // Set currentAgent based on data prop
  useEffect(() => {
    if (data && data.length > 0) {
      // Check if 'Default Agent' exists in data
      const defaultAgent = data.find(agent => agent.default)

      // Set currentAgent to 'Default Agent' if it exists, otherwise choose the first agent
      setCurrentAgent((defaultAgent || data[0]) as AgentInterface)
    }
  }, [data])

  const redirectToCloudAgents = () => {
    if (STANDALONE) {
      window.parent.postMessage({ type: 'redirect', href: '/agents' }, '*')
    }
  }

  return (
    <div>
      <List sx={{ width: '100%' }}>
        <ListItem
          alignItems="center"
        >
          <ListItemAvatar onClick={redirectToCloudAgents}>
            <BorderedAvatar
              alt={currentAgent ? currentAgent?.name?.at(0) || 'A' : 'newagent'}
              src={
                currentAgent && currentAgent.image
                  ? `https://pub-58d22deb43dc48e792b7b7468610b5f9.r2.dev/magick-dev/agents/${currentAgent.image}`
                  : undefined // Ensure it's undefined if there's no valid image URL.
              }
              sx={{ width: 24, height: 24 }}
            >
              {currentAgent?.name?.at(0) || 'A'}
            </BorderedAvatar>
          </ListItemAvatar>
          <ListItemText
            primary={currentAgent ? currentAgent?.name : 'New agent'}
          />
          <IconButton
            aria-label="expand"
            size="small"
            onClick={handleToggleMenu1}
          >
            <ExpandMoreIcon sx={{ placeContent: 'end' }} />
          </IconButton>
        </ListItem>
      </List>
      <Menu
        id="menu1"
        anchorEl={openMenu}
        open={Boolean(openMenu)}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          '& .MuiMenu-paper': {
            background: '#2B2B30',
            width: '210px',
            shadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
            borderRadius: '2px',
            border: '1px solid #3B3B3B',
            left: '0px !important',
            marginTop: '20px',
            marginLeft: '180px',
          },
        }}
      >
        {data?.map((agent, i) => {
          const agentImage =
            agent.image
              ? `https://pub-58d22deb43dc48e792b7b7468610b5f9.r2.dev/magick-dev/agents/${agent.image}`
              : undefined // Ensure it's undefined if there's no valid image URL.
          return (
            <MenuItem key={i + agent.id} >
              <ListItemAvatar sx={{ display: 'flex', alignItems: 'center' }}>
                <BorderedAvatar
                  alt={agent.name.at(0) || 'A'}
                  src={agentImage}
                  sx={{ width: 24, height: 24 }}
                >
                  {agent.name.at(0) || 'A'}
                </BorderedAvatar>
                <ListItemText
                  onClick={() => handleSelectAgent(agent)}
                  primary={agent.name}
                  sx={{ ml: 2 }}
                />
              </ListItemAvatar>
            </MenuItem>
          )
        })}
        <StyledDivider />
        <MenuItem
          onClick={() => {
            openTab({
              id: 'Agents',
              name: 'Agents',
              type: 'Agents',
              switchActive: true,
            })
            handleCloseMenu()
          }}
        >
          Manage agents
        </MenuItem>
      </Menu>
    </div>
  )
}
