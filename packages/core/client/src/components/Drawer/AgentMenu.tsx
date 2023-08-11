import React, { useEffect, useState } from 'react'
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
import { useNavigate } from 'react-router-dom'

function AgentMenu({ data }) {
  const navigate = useNavigate()
  const BorderedAvatar = styled(Avatar)`
    border: 1px solid lightseagreen;
  `

  const [openMenu1, setOpenMenu1] = React.useState(null)
  const [openMenu2, setOpenMenu2] = React.useState(null)

  const handleToggleMenu1 = event => {
    setOpenMenu1(event.currentTarget)
  }

  const handleCloseMenu1 = () => {
    setOpenMenu1(null)
  }

  const handleToggleMenu2 = event => {
    setOpenMenu2(event.currentTarget)
  }

  const handleCloseMenu2 = () => {
    setOpenMenu2(null)
  }

  const StyledDivider = styled(Divider)(({ theme }) => ({
    backgroundColor: 'black',
    marginTop: '4px',
    marginBottom: '4px',
  }))

  const handleSelectAgent = agent => {
  }

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
          <ListItemAvatar>
            <BorderedAvatar
              alt="Remy Sharp"
              src="https://c4.wallpaperflare.com/wallpaper/452/586/387/artwork-fantasy-art-wizard-books-skull-hd-wallpaper-preview.jpg"
              sx={{ width: 30, height: 30 }}
            />
          </ListItemAvatar>
          <ListItemText primary="Agent name" />
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
          return (
            <>
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
                key={i}
                onClick={() => handleSelectAgent(agent)}
              >
                <ListItemAvatar
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <BorderedAvatar
                    alt={agent?.name?.at(0) || 'A'}
                    src={agent.image ? agent.name : (agent?.name?.at(0) || 'A')}
                    sx={{ width: 24, height: 24 }}
                  />
                  <ListItemText primary={agent?.name} sx={{ ml: 2 }} />
                </ListItemAvatar>
                <ListItemIcon sx={{ placeContent: 'end' }}>
                  <MoreIcon
                    fontSize="small"
                    onClick={handleToggleMenu2}
                    aria-controls="menu2"
                    aria-haspopup="true"
                  />
                </ListItemIcon>
              </MenuItem>
              <StyledDivider />
            </>
          )
        })}

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
            navigate(`/magick/Agents-${encodeURIComponent(btoa('Agents'))}`)
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
        <MenuItem sx={{ py: 0 }}>Rename</MenuItem>
        <StyledDivider />
        <MenuItem sx={{ py: 0 }}>Delete</MenuItem>
        <StyledDivider />
        <MenuItem sx={{ py: 0 }}>Change Image</MenuItem>
        <StyledDivider />
        <MenuItem sx={{ py: 0 }}>Other Options</MenuItem>
      </Menu>
    </div>
  )
}

export default AgentMenu
