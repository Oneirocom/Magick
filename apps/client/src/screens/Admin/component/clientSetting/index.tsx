import { useEffect, useState } from 'react'
import Table from '../../common/Table'
import Search from '../../common/Search'
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { columnClientSetting } from '../../common/Variable/column'
import { useModal } from '../../../../contexts/ModalProvider'
import { useAppDispatch, useAppSelector } from '@/state/hooks'
import {
  retrieveClient,
  ClientRes,
  deleteClient,
  searchClient,
} from '../../../../state/admin/clientS/clientState'

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

const ClientSetting = () => {
  const dispatch = useAppDispatch()
  const {
    client,
    success,
    loading,
    deleteSuccess,
    createSuccess,
    updateSuccess,
  } = useAppSelector(state => state.client)
  let data: ClientRes = {
    message: '',
    payload: { data: [], pages: 0, totalItems: 0 },
  }
  const { openModal } = useModal()
  const [page, setPage] = useState(client.payload[0]?.currentPage)
  useEffect(() => {
    dispatch(retrieveClient({ currentPage: 1, page: 10 }))
  }, [dispatch, deleteSuccess, createSuccess, updateSuccess])

  const handleAddSetting = () => {
    openModal({
      modal: 'clientSettings',
      content: 'This is an example modal',
      name: 'Add',
    })
  }

  if (success) {
    data = client
  }

  const handledeleteClient = id => {
    dispatch(deleteClient(id))
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    dispatch(retrieveClient({ currentPage: newPage, page: 10 }))
    setPage(newPage)
  }

  const handeSearch = search => {
    dispatch(searchClient(search))
  }

  return (
    <div>
      <Typography variant="h3" gutterBottom component="div">
        Client Settings
      </Typography>
      <Container container spacing={2}>
        <Grid item xs={10}>
          <Typography variant="h6" gutterBottom component="div">
            These are all the Client settings you have created
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <ButtonCustom
            variant="contained"
            size="medium"
            fullWidth
            onClick={() => handleAddSetting()}
          >
            Add Setting
          </ButtonCustom>
        </Grid>
      </Container>
      <Search text="client" handleChange={handeSearch} />
      <Table
        column={columnClientSetting}
        data={data.payload[0]}
        handledelete={handledeleteClient}
        modal="clientSettings"
        page={page}
        handleChangePage={handleChangePage}
        loading={loading}
      />
    </div>
  )
}

export default ClientSetting
