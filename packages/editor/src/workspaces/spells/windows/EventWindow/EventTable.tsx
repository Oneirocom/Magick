// todo remove this and make a new event table component eventually.
//@ts-nocheck
import { useEffect, useMemo, useState } from 'react'
import {
  useAsyncDebounce,
  useGlobalFilter,
  useFilters,
  usePagination,
  useSortBy,
  useTable,
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
import { useConfig } from '../../../../contexts/ConfigProvider'
import { Button } from '@magickml/client-core'

const GlobalFilter = ({ globalFilter, setGlobalFilter }) => {
  const [value, setValue] = useState(globalFilter)
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined)
  }, 500)
  return (
    <input
      type="text"
      value={value || ''}
      onChange={e => {
        setValue(e.target.value)
        onChange(e.target.value)
      }}
      placeholder="Search events..."
      style={{ width: '40em', border:0, margin: 0 }}
    />
  )
}

const DefaultColumnFilter = ({
  column: { filterValue, setFilter, Header },
}) => {
  return (
    <input
      type="text"
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined)
      }}
      placeholder={Header}
      style={{
        width: '100%',
        border: 0,
        // 0 radius
        borderRadius: 0,
      }}
    />
  )
}

function EventTable({ events, updateCallback }) {
  const { enqueueSnackbar } = useSnackbar()
  const config = useConfig()

  const columns = useMemo(
    () => [
      {
        Header: 'Agent',
        accessor: 'agentId',
        disableSortBy: true,
      },
      {
        Header: 'Client',
        accessor: 'client',
        disableSortBy: true,
      },
      {
        Header: 'Sender',
        accessor: 'sender',
        disableSortBy: true,
      },
      {
        Header: 'Content',
        accessor: 'content',
        disableSortBy: true,
      },
      {
        Header: 'Type',
        accessor: 'type',
        disableSortBy: true,
      },
      {
        Header: 'Channel',
        accessor: 'channel',
        disableSortBy: true,
      },
      {
        Header: 'Entities',
        accessor: 'entities',
        disableFilters: true,
      },
      {
        Header: 'Observer',
        accessor: 'observer',
        disableFilters: false,
      },
      {
        Header: 'Date',
        accessor: 'date',
        disableFilters: false,
      },
      {
        Header: 'Actions',
        Cell: row => (
          <IconButton onClick={() => handleEventDelete(row.row.original)}>
            <VscTrash size={16} color="#ffffff" />
          </IconButton>
        ),
      },
    ],
    []
  )

  const updateEvent = async ({ id, ...rowData }, columnId, value) => {
    let reqBody = {
      ...rowData,
      [columnId]: value,
      projectId: config.projectId,
    }
    if (!_.isEqual(reqBody, rowData)) {
      const isUpdated = await axios.put(
        `${import.meta.env.VITE_APP_API_URL}/events/${id}`,
        reqBody
      )
      if (isUpdated) enqueueSnackbar('Event updated', { variant: 'success' })
      else enqueueSnackbar('Error updating event', { variant: 'error' })
      updateCallback()
    }
  }

  const EditableCell = ({
    value = '',
    row: { original: row },
    column: { id },
    updateEvent,
  }) => {
    const [val, setVal] = useState(value)
    const onChange = e => typeof val !== 'object' && setVal(e.target.value)
    const onBlur = e => updateEvent(row, id, val)
    useEffect(() => setVal(value), [value])
    return (
      <input
        value={val && typeof val === 'object' ? JSON.stringify(val.data) : val}
        onChange={onChange}
        onBlur={onBlur}
        className="bare-input"
      />
    )
  }

  const defaultColumn = {
    Cell: EditableCell,
    Filter: DefaultColumnFilter,
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
    state,
  } = useTable(
    {
      columns,
      data: events,
      defaultColumn,
      updateEvent,
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
    console.log('event to delete ::: ', event)
    const isDeleted = await axios.delete(
      `${import.meta.env.VITE_APP_API_URL}/events/${event.id}`
    )
    if (isDeleted) enqueueSnackbar('Event deleted', { variant: 'success' })
    else enqueueSnackbar('Error deleting Event', { variant: 'error' })
    updateCallback()
  }

  const originalRows = useMemo(
    () => flatRows.map(row => row.original),
    [flatRows]
  )

  return (
    <Stack spacing={2}>
      <Grid container justifyContent="left" style={{ padding: '1em' }}>
          <GlobalFilter
            globalFilter={state.globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
          <Button
            style={{
              display: 'inline',
              backgroundColor: 'purple',
              border: 'none',
              color: 'white',
              marginRight: '.5em',
              marginLeft: 'auto',
            }}
            name="refresh"
            onClick={updateCallback}
          >
            Refresh
          </Button>
          <CSVLink
            data={originalRows}
            filename="events.csv"
            target="_blank"
            style={{ 
              textDecoration: 'none',
              display: 'inline',
              marginLeft: '.5em',
              marginRight: '.5em',
            }}
          >
            <Button style={{ 
                            textDecoration: 'none',
                            display: 'inline',
                            backgroundColor: 'purple',
                            color: 'white',
                            border: 'none',
             }}>
              <FaFileCsv size={14} />
            </Button>
          </CSVLink>
      </Grid>
      <TableContainer component={Paper} style={{ width: '100%', padding: 0, margin: 0 }}>
        <Table style={{ width: '100%', padding: 0, margin: 0 }} {...getTableProps()}>
          <TableHead style={{ backgroundImage: 'none', padding: 0, margin: 0 }}>
            {headerGroups.map((headerGroup, idx) => (
              <TableRow {...headerGroup.getHeaderGroupProps()} key={idx} style={{ backgroundImage: 'none', padding: 0, margin: 0 }}>
                {headerGroup.headers.map((column, idx) => (
                  <TableCell
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    style={{ fontSize: '0.985rem', padding: '0em', margin: '0em', border: 0 }}
                    key={idx}
                  >
                    <Stack spacing={1}>
                      <div style={{position: 'relative'}}>
                        {column.canFilter ? column.render('Filter') : null}
                        <span style={{position: 'absolute', top: '.75em', right: '.75em', zIndex: '10'}}>
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <VscArrowDown size={14} />
                            ) : (
                              <VscArrowUp size={14} />
                            )
                          ) : (
                            ''
                          )}
                        </span>
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
                    <TableCell {...cell.getCellProps} key={idx}>
                      {cell.render('Cell')}
                    </TableCell>
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
        shape="rounded"
        showFirstButton
        showLastButton
      />
    </Stack>
  )
}

export default EventTable
