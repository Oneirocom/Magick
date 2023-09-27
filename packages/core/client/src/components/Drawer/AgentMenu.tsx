import { useState, useRef, useCallback, useEffect } from 'react'
import { styled } from '@mui/material/styles'
import Avatar from '@mui/material/Avatar'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import MoreIcon from '@mui/icons-material/MoreVert'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { IconBtn } from '@magickml/client-core'
import { Close, Done } from '@mui/icons-material'
import styles from './menu.module.css'
import { useConfig } from '@magickml/client-core'
import { enqueueSnackbar } from 'notistack'
import { useDispatch, useSelector } from 'react-redux'
import { Modal } from '@magickml/client-core'
import { DEFAULT_USER_TOKEN, STANDALONE, API_ROOT_URL } from '@magickml/config'

import { useFeathers } from '../../providers/FeathersProvider'

// todo fix this import
import { useSpellList } from '../../../../../plugins/avatar/client/src/hooks/useSpellList'
import { useTreeData } from '../../../../client/src/contexts/TreeDataProvider'
import NewMenuBar from '../../../../../editor/src/components/MenuBar/newMenuBar'
import { AgentInterface, SpellInterface } from '@magickml/core'
import { openTab, setCurrentAgentId } from '@magickml/state'

interface Spell {
  id: number
  name: string
  // Add other relevant properties
}

function AgentMenu({ data, resetData }) {
  const { client } = useFeathers()
  const [openMenu1, setOpenMenu1] = useState(null)
  const [openConfirm, setOpenConfirm] = useState<boolean>(false)
  const [openMenu2, setOpenMenu2] = useState(null)
  const [editMode, setEditMode] = useState<boolean>(false)
  const [oldName, setOldName] = useState<string>('')
  const [selectedAgentData, setSelectedAgentData] = useState<any>(null)
  const [currentAgent, _setCurrentAgent] = useState<AgentInterface | null>(null)
  const globalConfig = useSelector((state: any) => state.globalConfig)
  const token = globalConfig?.token
  const config = useConfig()
  const spellList: SpellInterface[] = useSpellList()
  const imageInputRef = useRef<HTMLInputElement>(null)
  const { agentUpdate, setAgentUpdate } = useTreeData()
  const dispatch = useDispatch()

  const setCurrentAgent = useCallback(
    (agent: AgentInterface) => {
      // Subscribe to agent service
      client.service('agents').subscribe(agent.id)
      _setCurrentAgent(agent)

      // store this current agent in the global state for use in the editor
      dispatch(setCurrentAgentId(agent.id))
    },
    []
  )

  const handleClose = () => {
    setOpenConfirm(false)
  }

  const onSubmit = () => {
    handleDelete(selectedAgentData.id)
    setOpenConfirm(false)
  }

  const BorderedAvatar = styled(Avatar)`
    border: 1px solid lightseagreen;
    ${STANDALONE && 'cursor: pointer;'}
  `

  const handleToggleMenu1 = event => {
    setOpenMenu1(event.currentTarget)
  }

  const handleCloseMenu1 = () => {
    setOpenMenu1(null)
  }

  const handleToggleMenu2 = useCallback(
    (agent, event) => {
      setOpenMenu2(event.currentTarget)
      setSelectedAgentData(agent)
    },
    [] // No external dependencies, so this callback won't change
  )

  const handleCloseMenu2 = () => {
    setOpenMenu2(null)
  }

  const update = (id: string, data = undefined) => {
    setAgentUpdate(false)
    const _data = data || { ...selectedAgentData }
    id = id || _data.id
    if (_data['id']) {
      delete _data.id
      delete _data?.dirty
    }

    if (_data['rootSpellId'] === null) {
      enqueueSnackbar('Root spell Is Missing', {
        variant: 'error',
      })
      return
    }

    // Avoid server-side validation error
    _data.enabled = _data.enabled ? true : false
    _data.updatedAt = new Date().toISOString()
    _data.secrets = _data.secrets ? _data.secrets : '{}'

    fetch(`${config.apiUrl}/agents/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(_data),
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(res.statusText)
        }
        return res.json()
      })
      .then(data => {
        enqueueSnackbar('Updated agent', {
          variant: 'success',
        })
        resetData()
        setSelectedAgentData(data)
        setAgentUpdate(true)
      })
      .catch(e => {
        console.error('ERROR', e)
        enqueueSnackbar(e, {
          variant: 'error',
        })
      })
  }
  const handleDelete = (id: string) => {
    fetch(`${config.apiUrl}/agents/` + id, {
      method: 'DELETE',
      headers: STANDALONE
        ? { Authorization: `Bearer ${DEFAULT_USER_TOKEN}` }
        : { Authorization: `Bearer ${token}` },
    })
      .then(async res => {
        res = await res.json()
        enqueueSnackbar('Agent with id: ' + id + ' deleted successfully', {
          variant: 'success',
        })
        if (selectedAgentData.id === id) setSelectedAgentData(undefined)
        resetData()
      })
      .catch(e => {
        enqueueSnackbar('Server Error deleting entity with id: ' + id, {
          variant: 'error',
        })
      })
  }

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }
    if (selectedAgentData.rootSpellId === null) {
      enqueueSnackbar('Root spell Is Missing', {
        variant: 'error',
      })
      return
    }
    // Create a FileReader instance
    const reader = new FileReader()
    // Read the file as a data URL
    reader.readAsDataURL(file)
    // Handle the load event
    reader.onload = () => {
      // Get the base64 string from the result
      const base64: any = reader.result
      // Remove the data URL prefix
      try {
        // Update the image property in selectedAgentData before uploading
        const updatedAgentData = {
          ...selectedAgentData,
          image: `${selectedAgentData.id}.jpg`,
        }

        fetch(`${API_ROOT_URL}/agentImage`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: base64,
            agentId: selectedAgentData.id,
          }),
        })
          .then(res => {
            if (!res.ok) {
              throw new Error(res.statusText)
            }
            return res
          })
          .then(data => {
            update(updatedAgentData.id, updatedAgentData)
            enqueueSnackbar('Updated Agent Image', {
              variant: 'success',
            })
            resetData()
          })
          .catch(e => {
            enqueueSnackbar(e, {
              variant: 'error',
            })
          })
      } catch (error) {
        console.log(`Error uploading file: ${error}`)
      }
    }
    // Handle the error event
    reader.onerror = error => {
      console.log(`Error reading file: ${error}`)
    }
  }

  const StyledDivider = styled(Divider)(({ theme }) => ({
    backgroundColor: 'black',
    marginTop: '4px',
    marginBottom: '4px',
  }))

  const handleSelectAgent = (agent: AgentInterface) => {
    setCurrentAgent(agent)

    if (spellList) {
      // Find a spell with the same ID as agent.rootSpellId
      const matchingSpell = spellList.find(
        spell => spell.id === agent.rootSpellId
      )

      if (matchingSpell) {
        const spellName = matchingSpell.name

        dispatch(openTab({
          id: agent.rootSpellId,
          name: spellName,
          spellName: spellName,
          type: 'spell',
        }))
      }
    }
    handleCloseMenu1()
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

  useEffect(() => {
    if (agentUpdate) {
      resetData()
    }
  }, [agentUpdate])

  return (
    <div>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        <ListItem
          alignItems="center"
          sx={{
            px: 1,
            py: 0,
            width: 200,
            justifyContent: 'space-between',
          }}
        >
          <NewMenuBar />
          <ListItemAvatar onClick={redirectToCloudAgents}>
            <BorderedAvatar
              alt={currentAgent ? currentAgent?.name?.at(0) || 'A' : 'newagent'}
              src={
                currentAgent && currentAgent.image
                  ? `https://pub-58d22deb43dc48e792b7b7468610b5f9.r2.dev/magick-dev/agents/${currentAgent.image}`
                  : currentAgent?.name?.at(0) || 'A'
              }
              sx={{ width: 24, height: 24 }}
            />
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
      {/* select agent modal 1 */}
      <Menu
        id="menu1"
        anchorEl={openMenu1}
        open={Boolean(openMenu1)}
        onClose={handleCloseMenu1}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{
          '& .MuiMenu-paper': {
            background: '#2B2B30',
            width: '210px',
            shadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
            borderRadius: '0px',
            left: '0px !important',
          },
        }}
      >
        {data?.map((agent, i) => {
          const primaryText =
            selectedAgentData?.id === agent.id
              ? selectedAgentData.name
              : agent?.name
          return (
            <MenuItem
              sx={{
                px: 1,
                py: 0,
                width: 200,
                justifyContent: 'space-between',
                '&:hover, &:focus': {
                  background: 'none',
                  outline: 'none',
                },
              }}
              key={i + agent.id}
            >
              {editMode && selectedAgentData?.id === agent?.id ? (
                <div>
                  <input
                    type="text"
                    name="name"
                    className={styles.inputEdit}
                    value={selectedAgentData.name}
                    onChange={e =>
                      setSelectedAgentData({
                        ...selectedAgentData,
                        name: e.target.value,
                      })
                    }
                    placeholder="Add new agent name here"
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        update(selectedAgentData.id)
                        setEditMode(false)
                        setOldName('')
                      }
                    }}
                  />
                  <IconBtn
                    label={'Done'}
                    Icon={<Done />}
                    onClick={e => {
                      update(selectedAgentData.id)
                      setEditMode(false)
                      setOldName('')
                    }}
                  />
                  <IconBtn
                    label={'close'}
                    Icon={<Close />}
                    onClick={e => {
                      setSelectedAgentData({
                        ...selectedAgentData,
                        name: oldName,
                      })
                      setOldName('')
                      setEditMode(false)
                    }}
                  />
                </div>
              ) : (
                <ListItemAvatar
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <BorderedAvatar
                    alt={primaryText.at(0) || 'A'}
                    src={
                      agent.image
                        ? `https://pub-58d22deb43dc48e792b7b7468610b5f9.r2.dev/magick-dev/agents/${agent.image}`
                        : primaryText.at(0) || 'A'
                    }
                    sx={{ width: 24, height: 24 }}
                  />
                  <ListItemText
                    onClick={() => handleSelectAgent(agent)}
                    primary={primaryText}
                    sx={{ ml: 2 }}
                  />
                </ListItemAvatar>
              )}
              <ListItemIcon sx={{ placeContent: 'end' }}>
                <MoreIcon
                  fontSize="small"
                  onClick={event => handleToggleMenu2(agent, event)}
                  aria-controls="menu2"
                  aria-haspopup="true"
                />
              </ListItemIcon>
            </MenuItem>
          )
        })}
        <StyledDivider />
        <MenuItem
          sx={{
            px: 1,
            py: 0,
            '&:hover, &:focus': {
              background: 'none',
              outline: 'none',
            },
          }}
          onClick={() => {
            dispatch(openTab({
              id: "Agents",
              name: 'Agents',
              type: 'Agents',
              switchActive: true
            }))
          }}
        >
          <List
            sx={{
              px: 0,
              py: 0,
            }}
          >
            <ListItem
              sx={{
                px: 0,
                py: 0,
              }}
            >
              <AddCircleIcon
                sx={{
                  mr: 1,
                }}
              />
              <ListItemText primary="Create New Agent" />
            </ListItem>
          </List>
        </MenuItem>
      </Menu>
      {/* select agent modal 2 */}
      <Menu
        id="menu2"
        anchorEl={openMenu2}
        open={Boolean(openMenu2)}
        onClose={handleCloseMenu2}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{
          '& .MuiMenu-paper': {
            background: '#2B2B30',
            width: '170px',
            shadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
            borderRadius: '0px',
          },
        }}
      >
        <MenuItem
          sx={{
            py: 0,
            '&:hover, &:focus': {
              background: 'none',
              outline: 'none',
            },
          }}
          onClick={e => {
            setEditMode(true)
            setOldName(selectedAgentData.name)
            handleCloseMenu2()
          }}
        >
          Rename
        </MenuItem>
        <StyledDivider />
        <MenuItem
          sx={{
            py: 0,
            '&:hover, &:focus': {
              background: 'none',
              outline: 'none',
            },
            color: `${selectedAgentData &&
              (selectedAgentData.default ? 'grey' : 'white')
              }`,
            cursor: `${selectedAgentData &&
              (selectedAgentData.default
                ? 'not-allowed'
                : 'pointer')
              }`,
          }}
          onClick={e => {
            if (!selectedAgentData.default) {
              setOpenConfirm(true)
            }
            handleCloseMenu2()
          }}

          disabled={data.length === 1}
        >
          Delete
        </MenuItem>
        <StyledDivider />
        <MenuItem
          sx={{
            py: 0,
            '&:hover, &:focus': {
              background: 'none',
              outline: 'none',
            },
          }}
          onClick={() => {
            imageInputRef?.current?.click()
            handleCloseMenu2()
          }}
        >
          Change Image
        </MenuItem>
        <StyledDivider />
        <MenuItem
          sx={{
            py: 0,
            '&:hover, &:focus': {
              background: 'none',
              outline: 'none',
            },
          }}
          onClick={() => {
            dispatch(openTab({
              id: "Agents",
              name: 'Agents',
              type: 'Agents',
              switchActive: true
            }))
          }}
        >
          Other Options
        </MenuItem>
      </Menu>
      {selectedAgentData && (
        <Modal
          open={openConfirm}
          onClose={handleClose}
          handleAction={onSubmit}
          title={`Delete ${selectedAgentData ? selectedAgentData.name : ''
            }  agent`}
          submitText="Confirm"
          children="Do you want to delete this agent?"
        />
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: 'none' }}
        ref={imageInputRef}
      />
    </div>
  )
}

export default AgentMenu
