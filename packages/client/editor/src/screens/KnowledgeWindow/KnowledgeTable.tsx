// KNOWLEDGEED
// Import statements kept as-is
import { TableComponent } from 'client/core'
import { MoreHoriz } from '@mui/icons-material'
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
import {
  TableInstance,
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table'
import { KnowledgeData, columns } from './knowledge'
import styles from './index.module.scss'
import KnowledgeModal from './KnowledgeModal'
import KnowledgeContentModal from './KnowledgeContentModal'
import { RootState, useCreateKnowledgeMutation, useDeleteKnowledgeMutation, useLazyGetKnowledgeByIdQuery } from 'client/state'
import { useSelector } from 'react-redux'

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

export type NewKnowledgeState = {
  name: string
  tag: string
  dataType: string
  sourceUrl: string
  projectId: string
  date: string
  files: any[]
}

/**
 * KnowledgeTable component for displaying knowledge in a table with sorting, filtering, and pagination.
 * @param {{ knowledge: any[] }} param0
 * @returns React.JSX.Element
 */
function KnowledgeTable({ knowledgeData }) {
  const [deleteKnowledge] = useDeleteKnowledgeMutation()
  const [getKnowledgeById] = useLazyGetKnowledgeByIdQuery()
  const [createKnowledge] = useCreateKnowledgeMutation()

  const globalConfig = useSelector((state: RootState) => state.globalConfig)
  const { currentAgentId } = globalConfig

  const { enqueueSnackbar } = useSnackbar()
  const config = useConfig()

  const [knowledge, setKnowledge] = useState(null)
  const [contentModal, setContentModal] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  // todo better typing here for the row
  const [selectedRow, setSelectedRow] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const { openDoc } = useTreeData()

  // Create mode state
  const [createMode, setCreateMode] = useState(false)
  // State for new knowledge
  const [newKnowledge, setNewKnowledge] = useState<NewKnowledgeState>({
    tag: '',
    name: '',
    dataType: '',
    sourceUrl: '',
    projectId: '',
    date: new Date().toISOString(),
    files: [],
  })

  const handleActionClick = (knowledge, row) => {
    setAnchorEl(knowledge.currentTarget)
    setSelectedRow(row)
  }

  const createData = (
    data: {
      row: any,
      tag: string,
      createdAt: string,
      dataType?: string,
      sourceUrl?: string
      name: string
    }
  ): KnowledgeData => {
    return {
      row: data.row,
      tag: data.tag,
      name: data.name,
      dataType: data.dataType,
      sourceUrl: data.sourceUrl,
      date: data.createdAt,
      action: (
        <>
          <IconButton
            aria-label="more"
            onClick={knowledge => handleActionClick(knowledge, data.row)}
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
        Header: 'Knowledgename',
        accessor: 'metadata.knowledgeName',
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
        Header: 'Knowledge Type',
        accessor: 'knowledgeType',
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
    state: { sortBy },
    setSortBy,
  } = useTable<any>(
    {
      columns: defaultColumns,
      data: knowledgeData,
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
      name: el.original.name,
      sourceUrl: el.original.sourceUrl,
      dataType: el.original.dataType || 'none',
      tag: el.original.metadata.tag || 'none',
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

  const resetNewKnowledge = () => {
    setNewKnowledge({
      tag: '',
      name: '',
      sourceUrl: '',
      projectId: '',
      date: '',
      dataType: '',
      files: [],
    })
  }

  // Handle knowledge deletion
  const handleKnowledgeDelete = async (knowledge: any) => {
    if (!selectedRow) return

    deleteKnowledge({ knowledgeId: selectedRow.id })
      .unwrap()
      .then(() => {
        enqueueSnackbar('Knowledge deleted', { variant: 'success' })
        // Close the action menu
        handleActionClose()
      })
      .catch(() => {
        enqueueSnackbar('Error deleting knowledge', { variant: 'error' })
      })
  }

  // Handle save action
  const handleSave = async selectedModel => {
    const { files, ...body } = newKnowledge
    // call knowledge endpoint

    const formData = new FormData()
    formData.append('projectId', config.projectId)
    formData.append('secrets', localStorage.getItem('secrets') || '')
    formData.append('tag', body.tag)
    formData.append('sourceUrl', body.sourceUrl)
    formData.append('name', body.name)
    for (const file of files as File[]) {
      formData.append('files', file, file.name)
    }
    formData.append('agentId', currentAgentId)

    createKnowledge({ knowledge: formData })
      .unwrap()
      .then(() => {
        resetNewKnowledge()
        enqueueSnackbar('Knowledge saved successfully', { variant: 'success' })
        setTimeout(() => {
          setCreateMode(false)
        }, 500)
      })
      .catch(err => {
        enqueueSnackbar('Error saving knowledge', { variant: 'error' })
      })
  }

  // Show create modal
  const showCreateModal = () => {
    setCreateMode(true)
  }

  const handleFindDoc = doc => {
    //fetch the knowledge
    getKnowledgeById(doc.id)
      .unwrap()
      .then((res) => {
        setKnowledge(res.content)
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
      <KnowledgeModal
        createMode={createMode}
        setCreateMode={setCreateMode}
        handleSave={handleSave}
        setNewKnowledge={setNewKnowledge} />
    )}
      {contentModal && knowledge && (
        <KnowledgeContentModal
          contentModal={contentModal}
          setContentModal={setContentModal}
          knowledge={knowledge}
        />
      )}
      <Container className={styles.container} classes={{ root: styles.root }}>
        <Stack spacing={2} style={{ padding: '1.5rem', background: 'transparent' }}>
          <div className={`${styles.flex} mt-8`}>
            <Typography variant="h4" className={styles.header}>
              Knowledge
            </Typography>
            <div className={styles.flex}>
              <Button
                variant="outlined"
                className={styles.btn}
                style={{ marginLeft: '1rem' }}
                name="refresh"
                onClick={showCreateModal}
              >
                Add knowledge
              </Button>
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
            handleDelete={handleKnowledgeDelete}
          />
        </Stack>
      </Container>
    </>
  )
}

export default KnowledgeTable
