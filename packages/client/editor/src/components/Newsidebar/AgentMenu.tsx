// @ts-nocheck
import { useState, useCallback, useEffect } from 'react'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Menu from '@mui/material/Menu'
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
import StyledDivider from './StyledDivider'
import { AgentInterface } from 'server/schemas'
import { Button } from '@magickml/client-ui'
import { Avatar, AvatarImage } from '@magickml/client-ui'

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

      if (draft) {
        setDraftAgent(draft)
        setCurrentAgent(currentAgent || draft)
      }

      const published = data.find(agent => agent.currentSpellReleaseId)
      setPublishedAgent(published)
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
    console.log('AGENT', agent)
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
    <div>
      <List sx={{ width: '100%' }}>
        <ListItem alignItems="center">
          <ListItemAvatar onClick={redirectToCloudAgents}>
            <Avatar
              className={clsx('self-center border border-ds-primary w-8 h-8')}
            >
              <AvatarImage
                className="object-cover w-full h-full rounded-full"
                src={`${process.env.NEXT_PUBLIC_BUCKET_PREFIX}${currentAgent?.image}`}
                alt={currentAgent?.name || 'Agent'}
              />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={currentAgent ? currentAgent?.name : 'New agent'}
            // secondary={`Version: ${currentAgent.}`}
          />
          <IconButton
            aria-label="expand"
            size="small"
            onClick={event => toggleMenu(event.target)}
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
        <h3
          style={{
            marginTop: 2,
            marginBottom: 4,
            marginLeft: 16,
          }}
        >
          Draft
        </h3>
        {draftAgent && (
          <AgentListItem
            key={draftAgent.id}
            agent={draftAgent}
            onSelectAgent={handleSelectAgent}
            isDraft
          />
        )}
        {publishedAgent && (
          <div>
            <StyledDivider />
            <h3
              style={{
                marginTop: 2,
                marginBottom: 4,
                marginLeft: 16,
              }}
            >
              Live Agent
            </h3>
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

        <StyledDivider />
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '0 16px',
          }}
        >
          <Button
            className="w-full mt-4 mb-4"
            // style={{
            //   backgroundColor: 'var(--primary)',
            //   border: 'none',
            //   marginTop: '8px',
            //   marginBottom: '8px',
            //   width: '100%',
            //   textAlign: 'center',
            //   justifyContent: 'center',
            // }}
            onClick={() => {
              console.log('handleMakeRelease')
              void handleMakeRelease()
            }}
          >
            Publish to Live Agent
          </Button>
        </div>
      </Menu>
    </div>
  )
}
