// FILEED
// Import statements kept as-is
import { TableComponent } from 'client/core'
import { CompletionProvider, pluginManager } from 'shared/core'
import { MoreHoriz, NewReleases } from '@mui/icons-material'
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
import {
  TableInstance,
  useAsyncDebounce,
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table'
import { DocumentData, columns } from './knowledge'
import styles from './index.module.scss'
import DocumentModal from './KnowledgeModal'
import DocContentModal from './KnowledgeContentModal'
import { RootState, useCreateFileMutation, useDeleteFileMutation, useLazyGetFileByIdQuery } from 'client/state'
import { useSelector } from 'react-redux'
/**
 * GlobalFilter component for applying search filter on the whole table.
 * @param {{ globalFilter: any, setGlobalFilter: Function }} param0
 * @returns React.JSX.Element
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
      placeholder="Search Files..."
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
 * FilesTable component for displaying files in a table with sorting, filtering, and pagination.
 * @param {{ files: any[] }} param0
 * @returns React.JSX.Element
 */
function FileTable({ files }) {
  const [deleteFile] = useDeleteFileMutation()
  const [getFileById] = useLazyGetFileByIdQuery()
  const [createFile] = useCreateFileMutation()

  const globalConfig = useSelector((state: RootState) => state.globalConfig)
  const { currentAgentId } = globalConfig

  useEffect(() => {
    console.log('FILES', files)
  }, [files])


  const { enqueueSnackbar } = useSnackbar()
  const filteredProviders = pluginManager.getCompletionProviders('text', [
    'embedding',
  ]) as CompletionProvider[]
  const config = useConfig()

  const [file, setFile] = useState(null)
  const [contentModal, setContentModal] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  // todo better typing here for the row
  const [selectedRow, setSelectedRow] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const { openDoc } = useTreeData()

  // Create mode state
  const [createMode, setCreateMode] = useState(false)
  // State for new file
  const [newFile, setNewFile] = useState({
    type: '',
    content: '',
    projectId: '',
    date: new Date().toISOString(),
    embedding: '',
    files: [],
  })

  const handleActionClick = (file, row) => {
    setAnchorEl(file.currentTarget)
    setSelectedRow(row)
  }

  const createData = (
    data: {
      row: any,
      fileName: any,
      type: string,
      createdAt: string
    }
  ): DocumentData => {
    return {
      row: data.row,
      type: data.type,
      fileName: data.fileName,
      date: data.createdAt,
      action: (
        <>
          <IconButton
            aria-label="more"
            onClick={file => handleActionClick(file, data.row)}
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
        accessor: 'metadata.type',
        disableSortBy: true,
      },
      {
        Header: 'Date',
        accessor: 'createdAt',
        disableFilters: false,
      },
      {
        Header: 'File Type',
        accessor: 'fileType',
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
      data: files,
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
    return createData({
      row: el.original,
      fileName: el.original.metadata?.fileName,
      type: el.original.type,
      createdAt: el.original.createdAt,
    })
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

  const resetNewFile = () => {
    setNewFile({
      type: '',
      content: '',
      projectId: '',
      date: '',
      embedding: '',
      files: [],
    })
  }

  // Handle file deletion
  const handleFileDelete = async (file: any) => {
    if (!selectedRow) return

    deleteFile({ fileId: selectedRow.id })
      .unwrap()
      .then(() => {
        enqueueSnackbar('File deleted', { variant: 'success' })
        // Close the action menu
        handleActionClose()
      })
      .catch(() => {
        enqueueSnackbar('Error deleting file', { variant: 'error' })
      })
  }

  // Get the original rows data
  const originalRows = useMemo(
    () => flatRows.map(row => row.original),
    [flatRows]
  )

  // Handle save action
  const handleSave = async selectedModel => {
    const { files, ...body } = newFile
    // call files endpoint

    const formData = new FormData()
    formData.append('projectId', config.projectId)
    formData.append('secrets', localStorage.getItem('secrets') || '')
    formData.append('type', body.type)
    for (const file of files as File[]) {
      formData.append('files', file, file.name)
    }
    formData.append('agentId', currentAgentId)

    createFile({ file: formData })
      .unwrap()
      .then(() => {
        resetNewFile()
        enqueueSnackbar('File saved successfully', { variant: 'success' })
        setTimeout(() => {
          setCreateMode(false)
        }, 500)
      })
      .catch(err => {
        enqueueSnackbar('Error saving file', { variant: 'error' })
      })
  }

  // Show create modal
  const showCreateModal = () => {
    setCreateMode(true)
  }

  const handleFindDoc = doc => {
    //fetch the file
    getFileById(doc.id)
      .unwrap()
      .then((res) => {
        setFile(res.content)
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
        setNewDocument={setNewFile} />
    )}
      {contentModal && file && (
        <DocContentModal
          contentModal={contentModal}
          setContentModal={setContentModal}
          document={file}
        />
      )}
      <Container className={styles.container} classes={{ root: styles.root }}>
        <Stack spacing={2} style={{ padding: '1.5rem', background: 'transparent' }}>
          <div className={styles.flex}>
            <Typography variant="h4" className={styles.header}>
              Files
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
                filename="files.csv"
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
            handleDelete={handleFileDelete}
          />
        </Stack>
      </Container>
    </>
  )
}

export default FileTable
