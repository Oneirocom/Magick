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
import { Button } from 'client/core'
import { useModal } from '../../contexts/ModalProvider'
import AgentListItem from '../../screens/agents/AgentWindow/AgentListItem'
import { useSnackbar } from 'notistack'


export function AgentMenu({ data }) {

  const { client } = useFeathers()
  const { openTab } = useTabLayout()
  const dispatch = useDispatch()
  const { openModal, closeModal } = useModal()
  const { enqueueSnackbar } = useSnackbar()

  const [openMenu, setOpenMenu] = useState(null)
  const [currentAgent, _setCurrentAgent] = useState<AgentInterface | null>(null)
  const [selectedAgents, setSelectedAgents] = useState<number[]>([])

  const setCurrentAgent = useCallback((agent: AgentInterface) => {
    client.service('agents').subscribe(agent.id)
    _setCurrentAgent(agent)
    // store this current agent in the global state for use in the editor
    dispatch(setCurrentAgentId(agent.id))
  }, [])

  // Set currentAgent based on data prop
  useEffect(() => {
    if (data && data.length > 0) {
      const defaultAgent = data.find(agent => agent.default)
      //TODO: This feels like a potential bug eventually
      // Set currentAgent to 'Default Agent' if it exists, otherwise choose the first agent
      setCurrentAgent((defaultAgent || data[0]) as AgentInterface)
    }
  }, [data])


  const publishedAgents = data?.filter(agent => agent.spellReleaseVersionID)
  const defaultAgent = data?.filter(agent => agent.default)

  const toggleMenu = (target = null) => {
    if (openMenu) {
      // Menu is currently open, so close it
      setOpenMenu(null);
      setSelectedAgents([]);
    } else {
      // Menu is currently closed, so open it at the specified target
      setOpenMenu(target);
    }
  };

  const handleSelectAgent = (agent: AgentInterface) => {
    setCurrentAgent(agent)
    toggleMenu()
  }

  const redirectToCloudAgents = () => {
    if (STANDALONE) {
      window.parent.postMessage({ type: 'redirect', href: '/agents' }, '*')
    }
  }


  const handleBatchPublish = (): void => {
    if (selectedAgents.length === 0) return
    openModal({
      modal: 'confirmationModal',
      title: 'Publish to agents',
      confirmButtonText: 'Publish',
      cancelButtonText: 'Cancel',
      children: (
        <div>
          <p>
            Are you sure you want to publish to the selected agents?
          </p>
        </div>
      ),
      onConfirm: async () => {
        await Promise.all(selectedAgents.map(async (agentId) => {
          const result = await client.service('agents').createRelease(agentId)
          //TODO: This should be a toast
          if (!result) {
            enqueueSnackbar('Failed to create release', { variant: 'error' })
            throw new Error('Failed to create release')
          }
          enqueueSnackbar('Successfully updated agents', { variant: 'success' })
          return result
        }))
        setSelectedAgents([])
        closeModal()
      }
    })
  }

  const handlePublish = async () => {
    await client.service('agents').createRelease(currentAgent.id)
  }

  const BorderedAvatar = styled(Avatar)`
    border: 1px solid lightseagreen;
    ${STANDALONE && 'cursor: pointer;'}
  `

  const StyledDivider = styled(Divider)(({ theme }) => ({
    backgroundColor: '#3D454A',
    borderColor: '#3D454A',
    height: '1px',
    marginTop: '4px',
    marginBottom: '4px',
    marginLeft: '10px',
    marginRight: '10px',
  }))


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
            onClick={(event) => toggleMenu(event.target)}
          >
            <ExpandMoreIcon sx={{ placeContent: 'end' }} />
          </IconButton>
        </ListItem>
      </List>
      <Menu
        id="menu1"
        anchorEl={openMenu}
        open={Boolean(openMenu)}
        onClose={toggleMenu}
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
            background: '#252525',
            width: '300px',
            shadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
            borderRadius: '2px',
            border: '1px solid #3B3B3B',
            left: '0px !important',
            marginTop: '6px',
            marginLeft: '40px',
          },
        }}
      >
        <h3 style={{
          marginTop: 2,
          marginBottom: 4,
          marginLeft: 16,
        }}>Draft</h3>
        {defaultAgent?.map((agent, i) => {
          return (
            <AgentListItem
              key={i + agent.id}
              agent={agent}
              onSelectAgent={handleSelectAgent}
            />
          )
        })}
        {
          publishedAgents && publishedAgents.length > 0 && (
            <>
              <StyledDivider />
              <h3 style={{
                marginTop: 2,
                marginBottom: 4,
                marginLeft: 16,
              }}>
                Published
              </h3>
              {publishedAgents.map((agent, i) => {
                return (
                  <AgentListItem
                    key={i + agent.id}
                    agent={agent}
                    onSelectAgent={handleSelectAgent}
                  />
                )
              }
              )}
            </>
          )
        }

        <StyledDivider />
        <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '0 16px' }}>
          {publishedAgents && publishedAgents.length > 0 ? (
            <Button
              disabled={!(selectedAgents.length > 0)}
              hoverStyle={{}}
              style={{
                backgroundColor: selectedAgents.length > 0 ? '#0074a0' : 'grey',
                border: 'none',
                marginTop: '8px',
                marginBottom: '8px'
              }}
              onClick={() => {
                void handleBatchPublish()
              }}
            >
              Publish to selected agents
            </Button>
          ) : (
            <Button
              hoverStyle={{}}
              style={{
                backgroundColor: '#0074a0',
                border: 'none',
                marginTop: '8px',
                marginBottom: '8px'
              }}
              onClick={() => {
                void handlePublish()
              }}
            >
              Publish this agent
            </Button>

          )}
          <MenuItem
            onClick={() => {
              openTab({
                id: 'Agents',
                name: 'Agents',
                type: 'Agents',
                switchActive: true,
              })
              toggleMenu()
            }}
          >
            Manage agents
          </MenuItem>
        </div>
      </Menu >
    </div >
  )
}
