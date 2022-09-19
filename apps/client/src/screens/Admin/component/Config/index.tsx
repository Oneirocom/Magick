import { useEffect, useState } from 'react'
import Table from '../../common/Table'
import Search from '../../common/Search'
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { columnConfig } from '../../common/Variable/column'
import { useModal } from '../../../../contexts/ModalProvider'
import { useAppDispatch, useAppSelector } from '@/state/hooks'
import {
  retrieveConfig,
  ConfigRes,
  deleteConfig,
  searchConfig,
} from '../../../../state/admin/config/configState'

const Container = styled(Grid)({
  marginBottom: '1.5rem',
})

const ButtonCustom = styled(Button)({
  background: '#424242',
  color: '#fff',
  border: '1px solid #636363',
  '&:hover': {
    background: '#424242',
  },
})

const Config = () => {
  const dispatch = useAppDispatch()
  const {
    config,
    success,
    deleteSuccess,
    createSuccess,
    updateSuccess,
    loading,
  } = useAppSelector(state => state.config)
  let data: ConfigRes = {
    message: '',
    payload: { data: [], totalItems: 0 },
  }

  const { openModal } = useModal()
  // const page = 1
  const [page, setPage] = useState(config.payload[0]?.currentPage)

  useEffect(() => {
    dispatch(retrieveConfig({ currentPage: 1, page: 10 }))
  }, [dispatch, deleteSuccess, createSuccess, updateSuccess])

  const handleAdd = () => {
    openModal({
      modal: 'config',
      content: 'This is an example modal',
      name: 'Add',
    })
  }

  if (success) {
    data = config
  }

  const handledeleteConfig = id => {
    dispatch(deleteConfig(id))
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    dispatch(retrieveConfig({ currentPage: newPage, page: 10 }))
    setPage(newPage)
  }

  const handeSearch = search => {
    dispatch(searchConfig(search))
  }

  return (
    <div>
      <Typography variant="h3" gutterBottom component="div">
        Configuration
      </Typography>
      <Container container spacing={2}>
        <Grid item xs={10}>
          <Typography variant="h6" gutterBottom component="div">
            These are all the Configurations you have created
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <ButtonCustom
            variant="contained"
            size="medium"
            fullWidth
            onClick={() => handleAdd()}
          >
            Add Config
          </ButtonCustom>
        </Grid>
      </Container>
      <Search text="Key" handleChange={handeSearch} />
      <Table
        column={columnConfig}
        data={data.payload[0]}
        handledelete={handledeleteConfig}
        modal="config"
        page={page}
        handleChangePage={handleChangePage}
        loading={loading}
      />
    </div>
  )
}

export default Config
