// DOCUMENTED
// Import statements kept as-is
import { Button, TableComponent } from '@magickml/client-core'
import { API_ROOT_URL } from '@magickml/core'
import { MoreHoriz, Refresh } from '@mui/icons-material'
import {
  Container,
  IconButton,
  Menu,
  MenuItem,
  Pagination,
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
  // const config = useConfig()
  const globalConfig = useSelector((state: any) => state.globalConfig)
  const token = globalConfig?.token

  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedRow, setSelectedRow] = useState(null)

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
            onClick={event => handleActionClick(event, row)}
            style={{ boxShadow: 'none' }}
          >
            <MoreHoriz />
          </IconButton>
        </>
      ),
    }
  }

  // Initialize the table with hooks
  const { page, flatRows, pageOptions, gotoPage, setGlobalFilter, state } =
    useTable(
      {
        columns,
        data: events,
      },
      useFilters,
      useGlobalFilter,
      useSortBy,
      usePagination
    )

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
    gotoPage(pageIndex)
  }

  const handleActionClose = () => {
    setAnchorEl(null)
    setSelectedRow(null)
  }

  // Handle event deletion
  const handleEventDelete = async (event: any) => {
    console.log('deleting event', event)
    const isDeleted = await fetch(`${API_ROOT_URL}/events/${selectedRow.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (isDeleted) enqueueSnackbar('Event deleted', { variant: 'success' })
    else enqueueSnackbar('Error deleting Event', { variant: 'error' })
    // close the action menu
    handleActionClose()
    updateCallback()
  }

  // Get the original rows data
  const originalRows = useMemo(
    () => flatRows.map(row => row.original),
    [flatRows]
  )

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
          <div className={styles.flex}>
            <GlobalFilter
              globalFilter={state.globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
          </div>
        </div>
        <TableComponent
          rows={rows}
          column={columns}
          handlePageChange={handlePageChange}
        />
        <ActionMenu
          anchorEl={anchorEl}
          handleClose={handleActionClose}
          handleDelete={handleEventDelete}
        />
        <div>
          <Pagination
            count={pageOptions.length}
            onChange={(e, page) => handlePageChange(page)}
            shape="rounded"
            showFirstButton
            showLastButton
          />
        </div>
      </Stack>
    </Container>
  )
}

export default EventTable
