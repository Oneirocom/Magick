// @ts-nocheck

import {
  IconButton,
  Stack,
  Typography,
  Button,
  Container,
  Menu,
  MenuItem,
} from '@mui/material'
import { API_ROOT_URL } from 'shared/config'
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
import { TableComponent } from 'client/core'
import { useFeathers } from '@magickml/providers'
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
  // todo better typing of this row state
  const [selectedRow, setSelectedRow] = useState<any>(null)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(0)

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

    if (page.length === 1) {
      const pageIndex = currentPage - 1
      setCurrentPage(pageIndex)
      gotoPage(pageIndex)
    }

    // close the action menu
    handleActionClose()
    updateCallback()
    setSelectedRows([])
  }

  // Handle events deletion
  const handleDeleteMany = async event => {
    const isDeleted = await client.service('request').remove(null, {
      query: {
        id: {
          $in: selectedRows,
        },
      },
    })

    if (isDeleted) {
      enqueueSnackbar('Requests deleted', { variant: 'success' })
      // Update the table data with the updated data from the server
      updateCallback()
      // Clear the selected rows
      setSelectedRows([])

      const updatedPageLength = page.length - selectedRows.length
      // Check if there are no more documents on the current page
      if (updatedPageLength === 0 && currentPage > 0) {
        const pageIndex = currentPage - 1
        setCurrentPage(pageIndex)
        // Go to the previous page
        gotoPage(pageIndex)
      }
    } else {
      enqueueSnackbar('Error deleting Requests', { variant: 'error' })
    }
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

  // @ts-ignore
  const {
    page,
    flatRows,
    pageOptions,
    gotoPage,
    setGlobalFilter,
    state: { sortBy, globalFilter },
    setSortBy,
  } = useTable(
    {
      columns: defaultColumns,
      data: requests,
      initialState: {
        // todo need to pass generic into useTable to fix this type error
        // @ts-ignore
        pageIndex: currentPage,
      },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  )

  // Handle page change
  const handlePageChange = (page: number) => {
    const pageIndex = page - 1
    setCurrentPage(pageIndex)
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
    spell: string
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
  const handleSort = column => {
    const isAsc =
      sortBy && sortBy[0] && sortBy[0].id === column && !sortBy[0].desc
    setSortBy([{ id: column, desc: isAsc ? isAsc : false }])
  }

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
      el.original.spell
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
