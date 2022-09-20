import React from 'react'
import Menu from '@mui/material/Menu'
import Stack from '@mui/material/Stack'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'

export default function FilterModal({ anchorEl, open, handleClose }) {
  const [selectedVal, SetSelectedVal] = React.useState('')

  const handleChange = (event: SelectChangeEvent) => {
    SetSelectedVal(event.target.value)
  }

  const handleApply = () => {
    handleClose()
  }

  const handleClear = () => {
    handleClose()
  }

  return (
    <Menu
      id="demo-positioned-menu"
      aria-labelledby="demo-positioned-button"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      PaperProps={{
        style: {
          width: `300px`,
          padding: '1rem',
        },
      }}
    >
      <Select
        value={selectedVal}
        onChange={handleChange}
        displayEmpty
        inputProps={{ 'aria-label': 'Without label' }}
        style={{ width: '100%' }}
      >
        <MenuItem value="">
          <em>Select</em>
        </MenuItem>
      </Select>
      <Stack spacing={2} direction="row" style={{ marginTop: '1rem' }}>
        <Button variant="contained" onClick={() => handleApply()}>
          Apply
        </Button>
        <Button color="primary" onClick={() => handleClear()}>
          Clear
        </Button>
      </Stack>
    </Menu>
  )
}
