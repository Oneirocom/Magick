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
import _ from 'lodash'
import { CSVLink } from 'react-csv'
import { useConfig } from '../../../../contexts/ConfigProvider'
import Button from 'packages/editor/src/components/Button'

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
      placeholder="Search requests..."
      style={{ width: '100%' }}
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
      placeholder={'Search ' + Header}
      style={{
        width: '100%',
      }}
    />
  )
}

function EventTable({ requests, updateCallback }) {
  const { enqueueSnackbar } = useSnackbar()
  const config = useConfig()

  const columns = useMemo(
    () => [
      {
        Header: 'Provider',
        accessor: 'provider',
      },
      {
        Header: 'Type',
        accessor: 'type',
      },
      {
        Header: 'Cost',
        accessor: 'cost',
      },
      {
        Header: 'Req Data',
        accessor: 'requestData',
      },
      {
        Header: 'Res Data',
        accessor: 'responseData',
      },
      {
        Header: 'Req Time',
        accessor: 'duration',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Code',
        accessor: 'statusCode',
      },
      {
        Header: 'Model',
        accessor: 'model',
      },
      {
        Header: 'Parameters',
        accessor: 'parameters',
      },
      {
        Header: 'Actions',
        Cell: row => (
          <IconButton onClick={() => handleRequestDelete(row.row.original)}>
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
      const resp = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/request/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reqBody),
        }
      )

      const json = await resp.json()

      if (json) enqueueSnackbar('Event updated', { variant: 'success' })
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
      data: requests,
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

  const handleRequestDelete = async (event: any) => {
    console.log('event to delete ::: ', event)
    // instead of deleting, call the updateEvent function with param hidden = true
    const resp = await fetch(
      `${import.meta.env.VITE_APP_API_URL}/request/${event.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hidden: true }),
      }
    )

    const json = await resp.json()

    if (json) enqueueSnackbar('Event deleted', { variant: 'success' })
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
        <Grid item xs={9.5}>
          <GlobalFilter
            globalFilter={state.globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        </Grid>
        <Grid item xs={1.5}>
          <Button
            style={{ marginLeft: '1em', display: 'inline', width: '8em' }}
            name="refresh"
            onClick={updateCallback}
          >
            Refresh
          </Button>
        </Grid>
        <Grid item xs={1}>
          <CSVLink
            data={originalRows}
            filename="requests.csv"
            target="_blank"
            style={{ textDecoration: 'none', display: 'inline', width: '8em' }}
          >
            <Button style={{ textDecoration: 'none', display: 'inline' }}>
              <FaFileCsv size={14} />
            </Button>
          </CSVLink>
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table style={{ width: 'calc(100% - 2em)' }} {...getTableProps()}>
          <TableHead style={{ backgroundColor: '#000' }}>
            {headerGroups.map((headerGroup, idx) => (
              <TableRow {...headerGroup.getHeaderGroupProps()} key={idx}>
                {headerGroup.headers.map((column, idx) => (
                  <TableCell
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    style={{ fontSize: '0.985rem' }}
                    key={idx}
                  >
                    <Stack spacing={1}>
                      <div>
                        {column.render('Header')}{' '}
                        <span>
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
