import * as React from 'react'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Checkbox from '@mui/material/Checkbox'
import Pagination from '@mui/material/Pagination'
import MoreHoriz from '@mui/icons-material/MoreHoriz'
import IconButton from '@mui/material/IconButton'
import ActionModal from '../component/ActionsModal'
import CircularProgress from '@mui/material/CircularProgress'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: 'rgba(70, 70, 70, 0.95)',
    color: theme.palette.common.white,
    fontSize: 16,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    // backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  'td, th': {
    border: 0,
  },
}))

const TableIndex = ({
  column,
  data,
  handledelete,
  modal,
  handleChangePage,
  page,
  loading,
}) => {
  const [dataId, setDataId] = React.useState('')
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>, id) => {
    setDataId(id)
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      {loading ? (
        <div
          style={{
            height: '80vh',
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <CircularProgress color="success" style={{ margin: '20% auto' }} />
        </div>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Select</StyledTableCell>
                {column.map(el => (
                  <StyledTableCell align="center" key={el.id}>
                    {el.name}
                  </StyledTableCell>
                ))}
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data &&
                data.data.map(row => {
                  const id = row.id

                  return (
                    <StyledTableRow key={id}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          inputProps={{
                            'aria-label': 'select all desserts',
                          }}
                        />
                      </TableCell>
                      {column.map((col, i) => {
                        const value = row[col.id]
                        return (
                          <>
                            <StyledTableCell
                              align="center"
                              key={`${value}_${i}`}
                            >
                              {value}
                            </StyledTableCell>
                          </>
                        )
                      })}
                      <TableCell padding="checkbox" align="center">
                        <IconButton onClick={e => handleClick(e, id)}>
                          <MoreHoriz />
                        </IconButton>
                      </TableCell>
                    </StyledTableRow>
                  )
                })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <ActionModal
        anchorEl={anchorEl}
        open={open}
        handleClose={handleClose}
        id={dataId}
        handledelete={handledelete}
        modal={modal}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '1.5rem',
        }}
      >
        <Pagination
          count={data?.totalPages || 1}
          variant="outlined"
          shape="rounded"
          page={page}
          onChange={handleChangePage}
        />
      </div>
    </div>
  )
}

export default TableIndex
