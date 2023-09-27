// DOCUMENTED
// Import statements kept as-is
import { TableComponent } from 'client/core'
import { API_ROOT_URL } from 'shared/config'
import { useFeathers } from 'client/core'
import { Delete, MoreHoriz, Refresh } from '@mui/icons-material'
import {
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material'
import { useSnackbar } from 'notistack'
import { useMemo, useState } from 'react'
import { CSVLink } from 'react-csv'
import { FaFileCsv } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import {
  useAsyncDebounce,
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table'
import { EventData, columns } from './event'
import styles from './index.module.scss'

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
      placeholder="Search events..."
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
 * EventTable component for displaying events in a table with sorting, filtering, and pagination.
 * @param {{ events: any[], updateCallback: Function }} param0
 * @returns JSX.Element
 */
function EventTable({ events, updateCallback }) {
  const { enqueueSnackbar } = useSnackbar()
  const globalConfig = useSelector((state: any) => state.globalConfig)
  const token = globalConfig?.token

  const [anchorEl, setAnchorEl] = useState(null)
  // todo need better typing for the row here
  const [selectedRow, setSelectedRow] = useState<any>(null)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(0)

  const { client: feathersClient } = useFeathers()

  const handleActionClick = (event, row) => {
    setAnchorEl(event.currentTarget)
    setSelectedRow(row)
  }

  const createData = (
    row: any,
    client: string,
    sender: string,
    content: string,
    type: string,
    channel: string,
    observer: string,
    date: string
  ): EventData => {
    return {
      row,
      client,
      sender,
      content,
      type,
      channel,
      observer,
      date,
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

  const defaultColumns = useMemo(
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
    ],
    []
  )

  // Initialize the table with hooks
  const tableInstance = useTable(
    {
      columns: defaultColumns,
      data: events,
      initialState: {
        // todo we need to pass ageneric into useTable to fix this type error
        // @ts-ignore
        pageIndex: currentPage,
      },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  )

  // tableInstance as any here is a workaround for the type error
  // for some reason the type of tableInstance is not being inferred correctly, and documentation sucks
  const {
    page,
    flatRows,
    pageOptions,
    gotoPage,
    setGlobalFilter,
    state: { sortBy, globalFilter },
    setSortBy,
  } = tableInstance as any

  // Function to handle sorting when a column header is clicked
  const handleSort = column => {
    const isAsc =
      sortBy && sortBy[0] && sortBy[0].id === column && !sortBy[0].desc
    setSortBy([{ id: column, desc: isAsc ? isAsc : false }])
  }

  const rows = page.map(el => {
    return createData(
      el.original,
      el.original.client,
      el.original.sender,
      el.original.content,
      el.original.type,
      el.original.channel,
      el.original.observer,
      new Date(el.original.date).toLocaleDateString()
    )
  })

  // // Handle pagination
  const handlePageChange = (page: number) => {
    const pageIndex = page - 1
    setCurrentPage(pageIndex)
    gotoPage(pageIndex)
  }

  const handleActionClose = () => {
    setAnchorEl(null)
    setSelectedRow(null)
  }

  // Handle events deletion
  const handleDeleteMany = async (event: any) => {
    const isDeleted = await feathersClient.service('events').remove(null, {
      query: {
        id: {
          $in: selectedRows,
        },
      },
    })

    if (isDeleted) {
      enqueueSnackbar('Events deleted', { variant: 'success' })
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
      enqueueSnackbar('Error deleting Event', { variant: 'error' })
    }
  }

  // Handle event deletion
  const handleEventDelete = async (event: any) => {
    const isDeleted = await fetch(`${API_ROOT_URL}/events/${selectedRow.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (isDeleted) enqueueSnackbar('Event deleted', { variant: 'success' })
    else enqueueSnackbar('Error deleting Event', { variant: 'error' })

    //navigate user to previous page if rows are empty
    if (page.length === 1) {
      const pageIndex = currentPage - 1
      setCurrentPage(pageIndex)
      gotoPage(pageIndex)
    }

    // close the action menu
    handleActionClose()
    updateCallback()
  }

  // Get the original rows data
  const originalRows = useMemo(
    () => flatRows.map(row => row.original),
    [flatRows]
  )

  console.log(page.length)

  // Render the table with useMemo
  return (
    <Container className={styles.container} classes={{ root: styles.root }}>
      <Stack spacing={2} style={{ padding: '1rem', background: '#272727' }}>
        <div className={styles.flex}>
          <Typography variant="h4" className={styles.header}>
            Events
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
            <CSVLink data={originalRows} filename="events.csv" target="_blank">
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
            className={`${styles.btn} ${
              selectedRows.length > 0 ? styles.selectedBtn : ''
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
          allowSort={true}
          selectedRows={selectedRows}
          setSelected={setSelectedRows}
          rows={rows}
          count={pageOptions.length}
          page={page}
          column={columns}
          handlePageChange={handlePageChange}
          handleSorting={handleSort}
        />
        <ActionMenu
          anchorEl={anchorEl}
          handleClose={handleActionClose}
          handleDelete={handleEventDelete}
        />
      </Stack>
    </Container>
  )
}

export default EventTable
