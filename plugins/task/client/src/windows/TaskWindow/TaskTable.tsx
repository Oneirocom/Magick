// DOCUMENTED
// Import statements kept as-is
import { Button } from '@magickml/client-core'
import { API_ROOT_URL } from '@magickml/core'
import {
  Grid,
  IconButton,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import _ from 'lodash'
import { useSnackbar } from 'notistack'
import { useEffect, useMemo, useState } from 'react'
import { CSVLink } from 'react-csv'
import { FaFileCsv } from 'react-icons/fa'
import { VscArrowDown, VscArrowUp, VscTrash } from 'react-icons/vsc'
import { useSelector } from 'react-redux'
import {
  useAsyncDebounce,
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table'
import { useConfig } from '@magickml/client-core'

/**
 * GlobalFilter component for applying search filter on the whole table.
 * @param {{ globalFilter: any, setGlobalFilter: Function }} param0
 * @returns JSX.Element
 */
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
      placeholder="Search tasks..."
      style={{ width: '40em', border: 0, margin: 0 }}
    />
  )
}

/**
 * DefaultColumnFilter component for applying filter on each column.
 * @param {{ column: { filterValue: any, setFilter: Function, Header: string } }} param0
 * @returns JSX.Element
 */
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
        borderRadius: 0,
      }}
    />
  )
}

/**
 * TaskTable component for displaying tasks in a table with sorting, filtering, and pagination.
 * @param {{ tasks: any[], updateCallback: Function }} param0
 * @returns JSX.Element
 */
function TaskTable({ tasks, updateCallback }) {
  const { enqueueSnackbar } = useSnackbar()
  const config = useConfig()
  const globalConfig = useSelector((state: any) => state.globalConfig)
  const token = globalConfig?.token

  // Define table columns
  const columns = useMemo(
    () => [
      {
        Header: 'Type',
        accessor: 'type',
        disableSortBy: false,
      },
      {
        Header: 'Objective',
        accessor: 'objective',
        disableSortBy: false,
      },
      {
        Header: 'Event Data',
        accessor: 'eventData',
        // stringify the cell value for display
        Cell: row => JSON.stringify(row.value),
      },
      {
        Header: 'Steps',
        accessor: 'steps',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Actions',
        Cell: row => (
          <IconButton onClick={() => handleTaskDelete(row.row.original)}>
            <VscTrash size={16} color="#ffffff" />
          </IconButton>
        ),
      },
    ],
    []
  )

  // Update task function
  const updateTask = async ({ id, ...rowData }, columnId, value) => {
    const reqBody = {
      ...rowData,
      [columnId]: value,
      projectId: config.projectId,
    }
    if (!_.isEqual(reqBody, rowData)) {
      const isUpdated = await fetch(`${API_ROOT_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reqBody),
      }).then(res => res.json())

      if (isUpdated) enqueueSnackbar('Task updated', { variant: 'success' })
      else enqueueSnackbar('Error updating task', { variant: 'error' })
      updateCallback()
    }
  }

  // Editable cell component
  const EditableCell = ({
    value = '',
    row: { original: row },
    column: { id },
    updateTask,
  }) => {
    const [val, setVal] = useState(value)
    const onChange = e => typeof val !== 'object' && setVal(e.target.value)
    const onBlur = e => updateTask(row, id, val)
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

  // Set default column properties
  const defaultColumn = {
    Cell: EditableCell,
    Filter: DefaultColumnFilter,
  }

  // Initialize the table with hooks
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
      data: tasks,
      defaultColumn,
      updateTask,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  )

  // Handle pagination
  const handlePageChange = (page: number) => {
    const pageIndex = page - 1
    gotoPage(pageIndex)
  }

  // Handle task deletion
  const handleTaskDelete = async (task: any) => {
    const isDeleted = await fetch(`${API_ROOT_URL}/tasks/${task.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (isDeleted) enqueueSnackbar('Task deleted', { variant: 'success' })
    else enqueueSnackbar('Error deleting Task', { variant: 'error' })
    updateCallback()
  }

  // Get the original rows data
  const originalRows = useMemo(
    () => flatRows.map(row => row.original),
    [flatRows]
  )

  // Render the table with useMemo
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
          filename="tasks.csv"
          target="_blank"
          style={{
            textDecoration: 'none',
            display: 'inline',
            marginLeft: '.5em',
            marginRight: '.5em',
          }}
        >
          <Button
            style={{
              textDecoration: 'none',
              display: 'inline',
              backgroundColor: 'purple',
              color: 'white',
              border: 'none',
            }}
          >
            <FaFileCsv size={14} />
          </Button>
        </CSVLink>
      </Grid>
      <TableContainer
        component={Paper}
        style={{ width: '100%', padding: 0, margin: 0 }}
      >
        <Table
          style={{ width: '100%', padding: 0, margin: 0 }}
          {...getTableProps()}
        >
          <TableHead style={{ backgroundImage: 'none', padding: 0, margin: 0 }}>
            {headerGroups.map((headerGroup, idx) => (
              <TableRow
                {...headerGroup.getHeaderGroupProps()}
                key={idx}
                style={{ backgroundImage: 'none', padding: 0, margin: 0 }}
              >
                {headerGroup.headers.map((column, idx) => (
                  <TableCell
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    style={{
                      fontSize: '0.985rem',
                      padding: '0em',
                      margin: '0em',
                      border: 0,
                    }}
                    key={idx}
                  >
                    <Stack spacing={1}>
                      <div style={{ position: 'relative' }}>
                        {column.canFilter ? column.render('Filter') : null}
                        <span
                          style={{
                            position: 'absolute',
                            top: '.75em',
                            right: '.75em',
                            zIndex: '10',
                          }}
                        >
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

export default TaskTable
