
import {
  IconButton,
  Stack,
  Typography,
  Button,
  Container,
  Menu,
  MenuItem,
} from '@mui/material'
import _ from 'lodash'
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
import { Refresh, MoreHoriz } from '@mui/icons-material'
import { TableComponent } from '@magickml/client-core'
import { DocumentData, columns } from './document'
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

  const handleActionClick = (document, row) => {
    setAnchorEl(document.currentTarget)
    setSelectedRow(row)
  }


  const handleActionClose = () => {
    setAnchorEl(null)
    setSelectedRow(null)
  }

  // Handle request deletion
  const handleRequestDelete = async (event: any) => {
    const resp = await fetch(`${API_ROOT_URL}/request/${selectedRow.id}`, {
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
    // close the action menu
    handleActionClose()
    updateCallback()
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
    ) as any

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

      action: (
        <>
          <IconButton
            aria-label="more"
            onClick={document => handleActionClick(document, row)}
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
        <div className={`${styles.flex} ${styles.flexEnd}`}>
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
          selectedRows={[]}
          handleSorting={handleSort}
          setSelected={() => {
            console.log('set selected not implemented for this table')
          }}
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
