// @ts-nocheck
import { useEffect, useMemo, useState } from 'react'
import { 
  useAsyncDebounce, 
  useGlobalFilter, 
  useFilters, 
  usePagination, 
  useSortBy, 
  useTable 
} from 'react-table'
import { 
  TableContainer, 
  Table, 
  TableHead, 
  TableBody, 
  TableRow, 
  TableCell, 
  Paper, 
  Pagination, 
  Stack,
  IconButton,
  Grid,
} from '@mui/material'
import { VscArrowDown, VscArrowUp, VscTrash } from 'react-icons/vsc'
import { FaFileCsv } from 'react-icons/fa'
import { useSnackbar } from 'notistack'
import axios from 'axios'
import _ from 'lodash'
import { CSVLink } from 'react-csv'

const GlobalFilter = ({ globalFilter, setGlobalFilter }) => {
  const [value, setValue] = useState(globalFilter)
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined)
  }, 500)
  return (
    <input
      type='text'
      value={value || ''}
      onChange={e => {
        setValue(e.target.value)
        onChange(e.target.value)
      }}
      placeholder='Search events...'
      style={{ width: '30%' }}
    />
  )
}

const DefaultColumnFilter = ({
  column: { filterValue, setFilter, Header },
}) => {
  return (
    <input 
      type='text' 
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined)
      }}
      placeholder={'Search ' + Header}
      style={{
        width: '80%',
        height: 'unset',
        paddingTop: '4px',
        paddingBottom: '4px'
      }}
    />
  )
}

function EventTable({ events, updateCallback }) {
  const { enqueueSnackbar } = useSnackbar()

  const columns = useMemo(() => [
    {
      Header: 'Agent',
      accessor: 'agent',
      disableSortBy: true
    },
    {
      Header: 'Client',
      accessor: 'client',
      disableSortBy: true
    },
    {
      Header: 'Sender',
      accessor: 'sender',
      disableSortBy: true
    },
    {
      Header: 'Text',
      accessor: 'text',
      disableSortBy: true
    },
    {
      Header: 'Type',
      accessor: 'type',
      disableSortBy: true
    },
    {
      Header: 'Channel',
      accessor: 'channel',
      disableSortBy: true
    },
    {
      Header: 'Date',
      accessor: 'date',
      disableFilters: true
    },
    {
      Header: 'Actions',
      Cell: row => (
        <IconButton onClick={() => handleEventDelete(row.row.original)}>
          <VscTrash size={16} color='#ffffff'/>
        </IconButton>
      )
    },
  ], [])

  const updateEvent = async ({ id, ...rowData }, columnId, value) => {
    let reqBody = {
      ...rowData,
      [columnId]: value
    }
    if(!_.isEqual(reqBody, rowData)) {
      const isUpdated = await axios.put(`${process.env.REACT_APP_API_ROOT_URL}/event/${id}`, reqBody)
      if(isUpdated) enqueueSnackbar('Event updated', { variant: 'success' })
      else enqueueSnackbar('Error updating event', { variant: 'error' })
      updateCallback()
    }
  }
  
  const EditableCell = ({ value, row: { original: row }, column: { id }, updateEvent }) => {
    const [val, setVal] = useState(value)
    const onChange = (e) => setVal(e.target.value)
    const onBlur = (e) => updateEvent(row, id, val)
    useEffect(() => setVal(value), [value])
    return <input 
      value={val} 
      onChange={onChange} 
      onBlur={onBlur} 
      className='bare-input'
    />
  }

  const defaultColumn = {
    Cell: EditableCell,
    Filter: DefaultColumnFilter
  }

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    flatRows,
    prepareRow,
    pageOptions,
    gotoPage,
    setGlobalFilter,
    state
  } = useTable(
    { 
      columns, 
      data: events,
      defaultColumn,
      updateEvent 
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  )

  const handlePageChange = (page: number) => {
    const pageIndex = page - 1
    gotoPage(pageIndex)
  }

  const handleEventDelete = async (event: any) => {
    console.log('event to delete ::: ', event);
    const isDeleted = await axios.delete(`${process.env.REACT_APP_API_ROOT_URL}/event/${event.id}`)
    if(isDeleted) enqueueSnackbar('Event deleted', { variant: 'success' })
    else enqueueSnackbar('Error deleting Event', { variant: 'error' })
    updateCallback()
  }

  const originalRows = useMemo(() => flatRows.map(row => row.original), [flatRows])

  return (
    <Stack spacing={2}>
      <Grid container justifyContent='space-between'>
        <Grid item xs={6}>
          <GlobalFilter 
            globalFilter={state.globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        </Grid>
        <Grid item xs={1}>
          <Grid container justifyContent='end'>
            <CSVLink 
              data={originalRows} 
              filename='events.csv' 
              target='_blank' 
              style={{ textDecoration: 'none' }}
            >
              <button><FaFileCsv size={20}/></button>
            </CSVLink>
          </Grid>
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table {...getTableProps()}>
          <TableHead style={{ backgroundColor: '#000'}}>
            {headerGroups.map((headerGroup, idx) => (
              <TableRow {...headerGroup.getHeaderGroupProps()} key={idx}>
                {headerGroup.headers.map((column, idx) => (
                  <TableCell 
                    {...column.getHeaderProps(column.getSortByToggleProps())} 
                    style={{fontSize: '0.985rem'}}
                    key={idx}
                  >
                    <Stack spacing={1}>
                      <div>
                        {column.render('Header')}{' '}
                        <span>
                          {column.isSorted ? 
                            column.isSortedDesc ? 
                              <VscArrowDown size={14} />
                              : <VscArrowUp size={14} /> 
                            : ''}
                        </span>
                      </div>
                      <div>
                        {column.canFilter ? column.render('Filter') : null}
                      </div>
                    </Stack>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {page.map((row: Row<object>, idx: number) => {
              prepareRow(row)
              return (
                <TableRow {...row.getRowProps()} key={idx}>
                  {row.cells.map((cell, idx) => (
                    <TableCell {...cell.getCellProps} key={idx}>{cell.render('Cell')}</TableCell>
                  ))}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination 
        count={pageOptions.length} 
        onChange={(e, page) => handlePageChange(page)} 
        shape='rounded' 
        showFirstButton 
        showLastButton
      />
    </Stack>
  )
}

export default EventTable