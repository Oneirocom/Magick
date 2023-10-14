// DOCUMENTED
// Import statements kept as-is
import { TableComponent } from 'client/core'
import { CompletionProvider, pluginManager } from 'shared/core'
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
import { useConfig, useTreeData } from '@magickml/providers'
import { useEffect, useMemo, useState } from 'react'
import { CSVLink } from 'react-csv'
import { FaFileCsv } from 'react-icons/fa'
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
import { DocumentData, columns } from './document'
import styles from './index.module.scss'
import DocumentModal from './DocumentModal'
import DocContentModal from './DocContentModal'
import { useCreateDocumentMutation, useDeleteDocumentMutation, useLazyGetDocumentByIdQuery } from 'client/state'
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
      placeholder="Search Documents..."
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
 * DocumentsTable component for displaying documents in a table with sorting, filtering, and pagination.
 * @param {{ documents: any[] }} param0
 * @returns JSX.Element
 */
function DocumentTable({ documents }) {
  const [deleteDocument] = useDeleteDocumentMutation()
  const [getDocumentById] = useLazyGetDocumentByIdQuery()
  const [createDocument] = useCreateDocumentMutation()


  const { enqueueSnackbar } = useSnackbar()
  const filteredProviders = pluginManager.getCompletionProviders('text', [
    'embedding',
  ]) as CompletionProvider[]
  const config = useConfig()
  const globalConfig = useSelector((state: any) => state.globalConfig)

  const [document, setDocument] = useState(null)
  const [contentModal, setContentModal] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  // todo better typing here for the row
  const [selectedRow, setSelectedRow] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const { openDoc } = useTreeData()

  // Create mode state
  const [createMode, setCreateMode] = useState(false)
  // State for new document
  const [newDocument, setNewDocument] = useState({
    type: '',
    content: '',
    projectId: '',
    date: new Date().toISOString(),
    embedding: '',
    files: [],
  })

  const handleActionClick = (document, row) => {
    setAnchorEl(document.currentTarget)
    setSelectedRow(row)
  }

  const createData = (
    row: any,
    fileName: any,
    content: string,
    type: string,
    projectId: string,
    date: string
  ): DocumentData => {
    return {
      row,
      fileName,
      content,
      type,
      projectId,
      date,
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

  const defaultColumns = useMemo(
    () => [
      {
        Header: 'Filename',
        accessor: 'metadata.fileName',
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
        Header: 'ProjectID',
        accessor: 'projectId',
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
    flatRows,
    pageOptions,
    gotoPage,
    setGlobalFilter,
    state: { sortBy, globalFilter },
    setSortBy,
  } = useTable<any>(
    {
      columns: defaultColumns,
      data: documents,
      initialState: {
        // todo we need to pass a proper generic into the useTable hook to fix this type error
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
      el.original.metadata?.fileName,
      el.original.content,
      el.original.type,
      el.original.projectId,
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

  const resetNewDocument = () => {
    setNewDocument({
      type: '',
      content: '',
      projectId: '',
      date: '',
      embedding: '',
      files: [],
    })
  }

  // Handle document deletion
  const handleDocumentDelete = async (document: any) => {
    if (!selectedRow) return

    deleteDocument({ documentId: selectedRow.id })
      .unwrap()
      .then(() => {
        enqueueSnackbar('Document deleted', { variant: 'success' })
        // Close the action menu
        handleActionClose()
      })
      .catch(() => {
        enqueueSnackbar('Error deleting document', { variant: 'error' })
      })
  }

  // Get the original rows data
  const originalRows = useMemo(
    () => flatRows.map(row => row.original),
    [flatRows]
  )

  // Handle save action
  const handleSave = async selectedModel => {
    const { files, ...body } = newDocument
    // call documents endpoint

    const formData = new FormData()
    formData.append('date', new Date().toISOString())
    formData.append('projectId', config.projectId)
    formData.append('modelName', selectedModel.model)
    formData.append('secrets', localStorage.getItem('secrets') || '')
    formData.append('type', body.type)
    formData.append('content', body.content)
    for (const file of files as File[]) {
      formData.append('files', file, file.name)
    }

    createDocument({ document: formData })
      .unwrap()
      .then(() => {
        resetNewDocument()
        enqueueSnackbar('Document saved successfully', { variant: 'success' })
        setTimeout(() => {
          setCreateMode(false)
        }, 500)
      })
      .catch(err => {
        enqueueSnackbar('Error saving document', { variant: 'error' })
      })
  }

  // Show create modal
  const showCreateModal = () => {
    setCreateMode(true)
  }

  const handleFindDoc = doc => {
    //fetch the document
    getDocumentById(doc.id)
      .unwrap()
      .then((res) => {
        setDocument(res.content)
        setContentModal(true)
      })
      .catch(err => {
        console.log(err)
      })
  }

  useEffect(() => {
    if (openDoc) {
      handleFindDoc(openDoc)
    }
  }, [openDoc])

  return (
    <>{createMode && (
      <DocumentModal
        createMode={createMode}
        setCreateMode={setCreateMode}
        handleSave={handleSave}
        setNewDocument={setNewDocument}
        providerList={filteredProviders}
      />
    )}
      {contentModal && document && (
        <DocContentModal
          contentModal={contentModal}
          setContentModal={setContentModal}
          document={document}
        />
      )}
      <Container className={styles.container} classes={{ root: styles.root }}>
        <Stack spacing={2} style={{ padding: '1rem', background: 'var(--background-color)' }}>
          <div className={styles.flex}>
            <Typography variant="h4" className={styles.header}>
              Documents
            </Typography>
            <div className={styles.flex}>
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
              <CSVLink
                data={originalRows}
                filename="documents.csv"
                target="_blank"
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
            handleDelete={handleDocumentDelete}
          />
        </Stack>
      </Container>
    </>
  )
}

export default DocumentTable
