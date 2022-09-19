import { useEffect, useState } from 'react'

import Table from '../../common/Table'
import Search from '../../common/Search'
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { columnScope } from '../../common/Variable/column'
import { useModal } from '../../../../contexts/ModalProvider'
import { useAppDispatch, useAppSelector } from '@/state/hooks'
import {
  retrieveScope,
  ScopeRes,
  deleteScope,
  searchScope,
} from '../../../../state/admin/scope/scopeState'

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

const Scope = () => {
  const dispatch = useAppDispatch()
  const {
    scope,
    success,
    loading,
    deleteSuccess,
    createSuccess,
    updateSuccess,
  } = useAppSelector(state => state.scope)
  let data: ScopeRes = {
    message: '',
    payload: { data: [], pages: 0, totalItems: 0 },
  }
  const { openModal } = useModal()
  const [page, setPage] = useState(scope.payload[0]?.currentPage)
  useEffect(() => {
    dispatch(retrieveScope({ currentPage: 1, page: 10 }))
  }, [dispatch, deleteSuccess, createSuccess, updateSuccess])

  const handleAddScope = () => {
    openModal({
      modal: 'scope',
      content: 'This is an example modal',
      name: 'Add',
    })
  }
  if (success) {
    data = scope.payload[0]
  }
  const handledeleteScope = id => {
    dispatch(deleteScope(id))
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    dispatch(retrieveScope({ currentPage: newPage, page: 10 }))
    setPage(newPage)
  }

  const handeSearch = search => {
    dispatch(searchScope(search))
  }

  return (
    <div>
      <Typography variant="h3" gutterBottom component="div">
        Scope
      </Typography>
      <Container container spacing={2}>
        <Grid item xs={10}>
          <Typography variant="h6" gutterBottom component="div">
            These are all the scope you have created
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <ButtonCustom
            variant="contained"
            size="medium"
            fullWidth
            onClick={() => handleAddScope()}
          >
            Add Scope
          </ButtonCustom>
        </Grid>
      </Container>
      <Search text="Tables" handleChange={handeSearch} />
      <Table
        column={columnScope}
        data={data}
        handledelete={handledeleteScope}
        modal="scope"
        page={page}
        handleChangePage={handleChangePage}
        loading={loading}
      />
    </div>
  )
}

export default Scope
