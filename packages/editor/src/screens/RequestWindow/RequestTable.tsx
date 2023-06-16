// DOCUMENTED
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
import {
  Row,
  useAsyncDebounce,
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table'
import { useConfig } from '@magickml/client-core'
import { useSelector } from 'react-redux'

/**
 * GlobalFilter component.
 * Filter the table data using a global search input.
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
      placeholder="Search requests..."
      style={{ width: '40em', border: 0, margin: 0 }}
    />
  )
}

/**
 * DefaultColumnFilter component.
 * Filter the table data using a column search input.
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
      style={{ width: '100%', border: 0, margin: 0, borderRadius: 0 }}
    />
  )
}

/**
 * RequestTable component.
 * Displays a table of requests with sorting, filtering, and pagination.
 */
function RequestTable({ requests, updateCallback }) {
  const { enqueueSnackbar } = useSnackbar()
  const config = useConfig()
  const globalConfig = useSelector((state: any) => state.globalConfig)
  const token = globalConfig?.token

  // Columns configuration for the table
  const columns = useMemo(
    () => [
      { Header: 'Provider', accessor: 'provider' },
      { Header: 'Type', accessor: 'type' },
      { Header: 'Node ID', accessor: 'nodeId' },
      {
        Header: 'Cost',
        accessor: 'cost',
        Cell: obj => '$' + obj.value.toFixed(7),
      },
      { Header: 'Req Time', accessor: 'duration' },
      { Header: 'Status', accessor: 'status' },
      { Header: 'Code', accessor: 'statusCode' },
      { Header: 'Model', accessor: 'model' },
      { Header: 'Req Data', accessor: 'requestData' },
      { Header: 'Res Data', accessor: 'responseData' },
      { Header: 'Parameters', accessor: 'parameters' },
      { Header: 'Spell', accessor: 'currentSpell' },
      {
        Header: ' ',
        Cell: row => (
          <IconButton onClick={() => handleRequestDelete(row.row.original)}>
            <VscTrash size={16} color="#ffffff" />
          </IconButton>
        ),
      },
    ],
    []
  )

  // Update request with the new data
  const updateRequest = async ({ id, ...rowData }, columnId, value) => {
    const reqBody = {
      ...rowData,
      [columnId]: value,
      projectId: config.projectId,
    }
    if (!_.isEqual(reqBody, rowData)) {
      const resp = await fetch(`${API_ROOT_URL}/request/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reqBody),
      })

      const json = await resp.json()

      if (json) enqueueSnackbar('Request updated', { variant: 'success' })
      else enqueueSnackbar('Error updating event', { variant: 'error' })
      updateCallback()
    }
  }

  // EditableCell component for inline editing of table cells
  const EditableCell = ({
    value = '',
    row: { original: row },
    column: { id },
    updateRequest,
  }) => {
    const [val, setVal] = useState(value)
    const onChange = e => typeof val !== 'object' && setVal(e.target.value)
    const onBlur = e => updateRequest(row, id, val)
    useEffect(() => setVal(value), [value])
    return (
      <input
        // @ts-ignore typescript not pocking up ternary operator check of val
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
      // todo we should upgrade to the latest version of react-table
      // @ts-ignore
      columns,
      data: requests,
      // @ts-ignore
      defaultColumn,
      updateRequest,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  ) as any

  // Handle page change
  const handlePageChange = (page: number) => {
    const pageIndex = page - 1
    gotoPage(pageIndex)
  }

  // Handle request deletion
  const handleRequestDelete = async (event: any) => {
    const resp = await fetch(`${API_ROOT_URL}/request/${event.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ hidden: true }),
    })

    const json = await resp.json()

    if (json) enqueueSnackbar('Request deleted', { variant: 'success' })
    else enqueueSnackbar('Error deleting Request', { variant: 'error' })
    updateCallback()
  }

  // Generate original rows data for CSV export
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
          filename="requests.csv"
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

export default RequestTable

import {
  IconButton,
  Stack,
  Typography,
  Button,
  Container,
  Menu,
  MenuItem,
} from '@mui/material'
import { API_ROOT_URL } from '@magickml/core'
import { useMemo, useState } from 'react'
import { CSVLink } from 'react-csv'
import { FaFileCsv } from 'react-icons/fa'
import {
  useAsyncDebounce,
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table'
import { useSelector } from 'react-redux'
import styles from './index.module.scss'
import { Delete, Refresh, MoreHoriz } from '@mui/icons-material'
import { TableComponent, useFeathers } from '@magickml/client-core'
import { DocumentData, columns } from './requests'
import { useSnackbar } from 'notistack'


/**
 * GlobalFilter component.
 * Filter the table data using a global search input.
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
      placeholder="Search requests..."
      className={styles.search}
    />
  )
}


function ActionMenu({ anchorEl, handleClose, handleDelete }) {
  return (
    <Menu
      id="action-menu"
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      <MenuItem onClick={handleDelete}>Delete</MenuItem>
    </Menu>
  )
}


/**
 * RequestTable component.
 * Displays a table of requests with sorting, filtering, and pagination.
 */
function RequestTable({ requests, updateCallback }) {
  const { enqueueSnackbar } = useSnackbar()
  const globalConfig = useSelector((state: any) => state.globalConfig)
  const token = globalConfig?.token
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedRow, setSelectedRow] = useState(null)
  const [selectedRows, setSelectedRows] = useState<string[]>([])

  const handleActionClick = (document, row) => {
    setAnchorEl(document.currentTarget)
    setSelectedRow(row)
  }


  const handleActionClose = () => {
    setAnchorEl(null)
    setSelectedRow(null)
  }

  const { client } = useFeathers()

  // Handle request deletion
  const handleRequestDelete = async (event: any) => {
    const resp = await fetch(`${API_ROOT_URL}/request/${selectedRow.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ hidden: true }),
    })

    const json = await resp.json()

    if (json) enqueueSnackbar('Request deleted', { variant: 'success' })
    else enqueueSnackbar('Error deleting Request', { variant: 'error' })
    // close the action menu
    handleActionClose()
    updateCallback()
    setSelectedRows([]);
  }

  // Handle events deletion
  const handleDeleteMany = async (event: any) => {
    const isDeleted: Array<unknown> = await client.service('request').remove(null, {
      query: {
        id: {
          $in: selectedRows
        }
      }
    })
    if (isDeleted) {
      enqueueSnackbar('Requests deleted', { variant: 'success' });
      updateCallback();
    } else {
      enqueueSnackbar('Error deleting Requests', { variant: 'error' });
    }

    // Clear the selected rows
    setSelectedRows([]);
  }


  const defaultColumns = useMemo(
    () => [
      {
        Header: 'Provider',
        accessor: 'provider',
        disableSortBy: true,
      },
      {
        Header: 'Type',
        accessor: 'type',
        disableSortBy: true,
      },
      {
        Header: 'Node ID',
        accessor: 'nodeId',
        disableSortBy: true,
      },
      {
        Header: 'Cost',
        accessor: 'cost',
        disableSortBy: true,
      },
      {
        Header: 'Req Time',
        accessor: 'requestTime',
        disableSortBy: true,
      },
      {
        Header: 'Status',
        accessor: 'status',
        disableSortBy: true,
      },
      {
        Header: 'Code',
        accessor: 'statusCode',
        disableSortBy: true,
      },
      {
        Header: 'Model',
        accessor: 'model',
        disableSortBy: true,
      },
      {
        Header: 'Req Data',
        accessor: 'requestData',
        disableSortBy: true,
      },
      {
        Header: 'Res Data',
        accessor: 'responseData',
        disableSortBy: true,
      },
      {
        Header: 'Parameters',
        accessor: 'parameters',
        disableSortBy: true,
      },
    ],
    []
  )

  const { page, flatRows, pageOptions, gotoPage, setGlobalFilter, state: { sortBy, globalFilter },
    setSortBy } =
    useTable(
      {
        columns: defaultColumns,
        data: requests,
      },
      useFilters,
      useGlobalFilter,
      useSortBy,
      usePagination
    )

  // Handle page change
  const handlePageChange = (page: number) => {
    const pageIndex = page - 1
    gotoPage(pageIndex)
  }



  // Generate original rows data for CSV export
  const originalRows = useMemo(
    () => flatRows.map(row => row.original),
    [flatRows]
  )
  const createData = (
    row: any,
    provider: string,
    type: string,
    nodeId: string,
    cost: string,
    duration: string,
    status: string,
    statusCode: string,
    model: string,
    requestData: string,
    responseData: string,
    parameters: string,
    spell: string,

  ): DocumentData => {
    return {
      row,
      provider,
      type,
      nodeId,
      cost,
      duration,
      status,
      statusCode,
      model,
      requestData,
      responseData,
      parameters,
      spell,
      action: (
        <>
          <IconButton
            aria-label="more"
            onClick={event => {
              event.stopPropagation()
              handleActionClick(event, row)
            }}
            style={{ boxShadow: 'none' }}
          >
            <MoreHoriz />
          </IconButton>
        </>
      ),
    }
  }

  // Function to handle sorting when a column header is clicked
  const handleSort = (column) => {
    const isAsc = sortBy && sortBy[0] && sortBy[0].id === column && !sortBy[0].desc;
    setSortBy([{ id: column, desc: isAsc ? isAsc : false }]);
  };

  const rows = page.map(el => {
    return createData(
      el.original,
      el.original.provider,
      el.original.type,
      el.original.nodeId,
      el.original.cost,
      el.original.duration,
      el.original.status,
      el.original.statusCode,
      el.original.model,
      el.original.requestData,
      el.original.responseData,
      el.original.parameters,
      el.original.spell,

    )
  })


  return (
    <Container className={styles.container} classes={{ root: styles.root }}>

      <Stack spacing={2} style={{ padding: '1rem', background: '#272727' }}>
        <div className={styles.flex}>
          <Typography variant="h4" className={styles.header}>
            Requests
          </Typography>
          <div className={styles.flex}>

            <Button
              variant="outlined"
              className={styles.btn}
              startIcon={<Refresh />}
              name="refresh"
              onClick={updateCallback}
            >
              Refresh
            </Button>
            <CSVLink
              data={originalRows}
              filename="requests.csv"
              target="_blank"
              style={{
                textDecoration: 'none',
                display: 'inline',
                marginLeft: '.5em',
                marginRight: '.5em',
              }}
            >
              <Button
                className={styles.btn}
                variant="outlined"
                startIcon={<FaFileCsv size={14} />}
                style={{ marginLeft: '1rem' }}
              >
                export
              </Button>
            </CSVLink>
          </div>
        </div>
        <div className={styles.flex}>
          <Button
            className={`${styles.btn} ${selectedRows.length > 0 ? styles.selectedBtn : ''
              }`}
            onClick={handleDeleteMany}
            variant="outlined"
            startIcon={<Delete />}
            disabled={selectedRows.length === 0}
          >
            Delete Selected({selectedRows.length})
          </Button>
          <div className={styles.flex}>
            <GlobalFilter
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
          </div>
        </div>
        <TableComponent
          rows={rows}
          page={page}
          count={pageOptions.length}
          handleSorting={handleSort}
          selectedRows={selectedRows}
          setSelected={setSelectedRows}
          column={columns}
          handlePageChange={handlePageChange}
        />
        <ActionMenu
          anchorEl={anchorEl}
          handleClose={handleActionClose}
          handleDelete={handleRequestDelete}
        />
      </Stack>
    </Container>
  )
}

export default RequestTable
