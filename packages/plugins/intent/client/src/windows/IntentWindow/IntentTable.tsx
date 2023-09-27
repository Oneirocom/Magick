// DOCUMENTED
// Import statements kept as-is
import { TableComponent } from '@magickml/client-core'
import { CompletionProvider, pluginManager } from '@magickml/core'
import { API_ROOT_URL } from 'shared/config'
import { MoreHoriz, NewReleases, Refresh } from '@mui/icons-material'
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
import { useConfig } from '@magickml/client-core'
import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  TableInstance,
  useAsyncDebounce,
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table'
import { IntentData, columns } from './intent'
import styles from './index.module.scss'
import IntentModal from './IntentModal'

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
      placeholder="Search Intent..."
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
 * IntentTable component for displaying intent documents in a table with sorting, filtering, and pagination.
 * @param {{ intents: any[], updateCallback: Function }} param0
 * @returns JSX.Element
 */
function IntentTable({ intents, updateCallback }) {
  const { enqueueSnackbar } = useSnackbar()
  const filteredProviders = pluginManager.getCompletionProviders('text', [
    'embedding',
  ]) as CompletionProvider[]
  const chatProviders = pluginManager.getCompletionProviders('text', [
    'text',
    'chat',
  ]) as CompletionProvider[]
  const config = useConfig()
  const globalConfig = useSelector((state: any) => state.globalConfig)
  const token = globalConfig?.token

  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedRow, setSelectedRow] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(0)

  const handleActionClick = (intent, row) => {
    setAnchorEl(intent.currentTarget)
    setSelectedRow(row)
  }

  const createData = (
    row: any,
    content: string,
    type: string,
    intent: string,
    date: string
  ): IntentData => {
    return {
      row,
      content,
      type,
      intent,
      date,
      action: (
        <>
          <IconButton
            aria-label="more"
            onClick={intent => handleActionClick(intent, row)}
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
        Header: 'Content',
        accessor: 'content',
        disableSortBy: true,
      },
      {
        Header: 'Intent',
        accessor: 'intent',
        disableSortBy: true,
      },
      {
        Header: 'Type',
        accessor: 'type',
        disableSortBy: true,
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
  const {
    page,
    pageOptions,
    gotoPage,
    setGlobalFilter,
    state: { sortBy, globalFilter },
    setSortBy,
  } = useTable(
    {
      columns: defaultColumns,
      data: intents,
      initialState: {
        // todo needto add proper generic to useTable to fix this
        // @ts-ignore
        pageIndex: currentPage,
      },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  ) as TableInstance & any //TODO: FIX Type

  // Function to handle sorting when a column header is clicked
  const handleSort = column => {
    const isAsc =
      sortBy && sortBy[0] && sortBy[0].id === column && !sortBy[0].desc
    setSortBy([{ id: column, desc: isAsc ? isAsc : false }])
  }

  const rows = page.map(el => {
    return createData(
      el.original,
      el.original.content,
      el.original.type,
      el.original.intent,
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

  // Handle intent deletion
  const handleIntentDelete = async (intent: any) => {
    if (!selectedRow) return
    const isDeleted = await fetch(
      `${API_ROOT_URL}/documents/${selectedRow.id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    if (isDeleted) enqueueSnackbar('intent deleted', { variant: 'success' })
    else enqueueSnackbar('Error deleting intent', { variant: 'error' })

    if (page.length === 1) {
      const pageIndex = currentPage - 1
      setCurrentPage(pageIndex)
      gotoPage(pageIndex)
    }

    // close the action menu
    handleActionClose()
    updateCallback()
  }

  // Create mode state
  const [createMode, setCreateMode] = useState(false)
  // State for new intent
  const [newIntent, setNewIntent] = useState({
    type: '',
    content: '',
    intent: '',
    date: new Date().toISOString(),
    embedding: '',
    variations: 0,
  })
  // Handle save action
  const handleSave = async selectedModel => {
    // call documents endpoint
    const result = await fetch(`${API_ROOT_URL}/intents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        date: new Date().toISOString(),
        type: newIntent.type,
        content: newIntent.content,
        embedding: newIntent.embedding,
        metadata: `{"intent": {"name": "${newIntent.intent}", "type": "story"}}`,
        projectId: config.projectId,
        modelName: selectedModel.model,
        variations: newIntent.variations > 20 ? 20 : newIntent.variations,
        chatModelName: 'gpt-3.5-turbo',
        secrets: localStorage.getItem('secrets'),
      }),
    })
    // Check if the save operation was successful
    if (result.ok) {
      // Reset newIntent
      setNewIntent({
        type: '',
        content: '',
        intent: '',
        date: '',
        embedding: '',
        variations: 0,
      })
      enqueueSnackbar('Intent saved successfully', { variant: 'success' })

      // Close the modal by setting createMode to false after a delay
      setTimeout(() => {
        setCreateMode(false)
      }, 2000)

      // Trigger the updateCallback function to update the table after a delay

      updateCallback()
    } else {
      enqueueSnackbar('Error saving intent', { variant: 'error' })
    }
  }

  // Show create modal
  const showCreateModal = () => {
    setCreateMode(true)
  }

  // trigger updateCallback when createMode changes
  useEffect(() => {
    if (!createMode) {
      updateCallback()
    }
  }, [createMode])
  return (
    <>
      {createMode && (
        <IntentModal
          createMode={createMode}
          setCreateMode={setCreateMode}
          handleSave={handleSave}
          setNewIntent={setNewIntent}
          providerList={filteredProviders}
          chatProviderList={chatProviders}
        />
      )}
      <Container className={styles.container} classes={{ root: styles.root }}>
        <Stack spacing={2} style={{ padding: '1rem', background: '#272727' }}>
          <div className={styles.flex}>
            <Typography variant="h4" className={styles.header}>
              Intents
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
              <Button
                variant="outlined"
                className={styles.btn}
                startIcon={<NewReleases />}
                style={{ marginLeft: '1rem' }}
                name="refresh"
                onClick={showCreateModal}
              >
                Create New
              </Button>
              {/* <CSVLink data={originalRows} filename="documents.csv" target="_blank">
                <Button
                  className={styles.btn}
                  variant="outlined"
                  startIcon={<FaFileCsv size={14} />}
                  style={{ marginLeft: '1rem' }}
                >
                  export
                </Button>
              </CSVLink> */}
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
            handleDelete={handleIntentDelete}
          />
        </Stack>
      </Container>
    </>
  )
}

export default IntentTable
