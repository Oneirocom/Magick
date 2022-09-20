import React, { useEffect } from 'react'
import { styled } from '@mui/material/styles'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import FilterModal from '../component/FilterModal'

const OutlineButton = styled(Button)({
  color: '#fff',
  border: '2px solid #636363',
  '&:hover': {
    border: '1px solid #636363',
  },
})

const Container = styled(Grid)({
  marginBottom: '1.5rem',
})

interface Props {
  text: string
  handleChange: Function
}

const Search = (props: Props) => {
  const [search, setSearch] = React.useState('')
  const { text, handleChange } = props
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    handleChange(search)
  }, [search])

  return (
    <div>
      <Container container spacing={2}>
        <Grid item xs={11}>
          <FormControl sx={{ width: '100%' }}>
            <OutlinedInput
              value={search}
              placeholder={`Search for ${text}`}
              onChange={e => setSearch(e.target.value)}
            />
          </FormControl>
        </Grid>
        <Grid item xs={1}>
          <OutlineButton
            variant="outlined"
            size="medium"
            fullWidth
            onClick={e => handleClick(e)}
          >
            Filter
          </OutlineButton>
        </Grid>
      </Container>
      <FilterModal anchorEl={anchorEl} open={open} handleClose={handleClose} />
    </div>
  )
}

export default Search
