'use client'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Button,
  DataTable,
  Checkbox,
  Badge,
  DropdownMenuItem,
  Input,
} from '@magickml/client-ui'
import { createEmbedderReactClient } from '@magickml/embedder-client-react'
import { useAtom } from 'jotai'
import { WindowContainer, WindowHeader } from 'windows-shared'
import { LoaderPicker } from './loader-picker'
import KnowledgePackCard from '../_pkg/knowledge-pack-card'
import { CreateKnowledgePackDialog } from '../_pkg/create-pack'
import { activePackIdAtom } from '../_pkg/state'
import { Loader } from '@magickml/embedder-schemas'
import { ColumnDef, Row } from '@tanstack/react-table'
import { useEffect, useState } from 'react'
import { useConfig } from '@magickml/providers'
import { ChunksDialog } from '../_pkg/chunks-dialog'
import { CopyIcon } from '@radix-ui/react-icons'
import { RootState } from 'client/state'
import { useSelector } from 'react-redux'
import { enqueueSnackbar } from 'notistack'

type KnowledgeWindowProps = {}
export const KnowledgeWindow: React.FC<KnowledgeWindowProps> = () => {
  const config = useConfig()
  const { projectId, embedderToken } = config

  const { currentAgentId } = useSelector(
    (state: RootState) => state.globalConfig
  )
  const createDialogState = useState(false)
  const chunksDialogState = useState(false)
  const [rowSelection, setRowSelection] = useState<Record<string, any>>({})
  const [apiKey, setApiKey] = useState<string | null>(null)
  const client = createEmbedderReactClient({
    tsqPrefix: 'embedder',
    baseUrl:
      process.env.NEXT_PUBLIC_EMBEDDER_SERVER_URL ||
      'http://localhost:3000/api',
    options: {
      axiosConfig: {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${embedderToken}`,
        },
      },
    },
  })

  const { data: knowledgePacks, refetch: refetchKnowlegePacks } =
    client.useGetPacksByEntityAndOwner()

  const [activePackId, setActivePackId] = useAtom(activePackIdAtom)
  const [activeLoaderId, setActiveLoaderId] = useState<string | null>(null)

  const { mutateAsync: deleteLoader } = client.useDeleteLoader({
    params: {
      id: activePackId || '',
    },
  })

  const { data: activePack, refetch: refetchActivePack } = client.useFindPack(
    {
      params: {
        id: activePackId || '',
      },
    },
    {
      enabled: !!activePackId,
    }
  )

  const { mutateAsync: deletePack } = client.useDeletePackWithBody()

  const [awaitingDeletionUpdate, setAwaitingDeletionUpdate] = useState(false)

  useEffect(() => {
    if (!awaitingDeletionUpdate) return
    const currentActivePack = activePack
    const currentLoaders = currentActivePack?.loaders
    const delayMs = 1000
    const maxPolls = 10
    let polls = 0
    const pollInterval = setInterval(async () => {
      await refetchActivePack()
      polls++
      if (
        currentLoaders?.length !== currentActivePack?.loaders.length ||
        polls > maxPolls
      ) {
        clearInterval(pollInterval)
        setAwaitingDeletionUpdate(false)
        polls = 0
      }
    }, delayMs)
  }, [awaitingDeletionUpdate, activePack, refetchActivePack])

  const [awaitingUploadUpdate, setAwaitingUploadUpdate] = useState(false)

  useEffect(() => {
    if (!awaitingUploadUpdate) return
    const delayMs = 1000
    const maxPolls = 10
    let polls = 0
    const pollInterval = setInterval(async () => {
      await refetchActivePack()
      polls++
      const hasPendingUpload = activePack?.loaders.some(
        (loader: any) => loader.status !== 'completed'
      )
      if (!hasPendingUpload || polls > maxPolls) {
        clearInterval(pollInterval)
        setAwaitingUploadUpdate(false)
        polls = 0
      }
    }, delayMs)
    return () => clearInterval(pollInterval)
  }, [awaitingUploadUpdate, activePack, refetchActivePack])

  const [awaitingPackDeletion, setAwaitingPackDeletion] = useState(false)

  useEffect(() => {
    if (!awaitingPackDeletion) return
    const currentActivePack = activePack
    const delayMs = 1000
    const maxPolls = 10
    let polls = 0
    const pollInterval = setInterval(async () => {
      await refetchKnowlegePacks()
      polls++

      if (
        currentActivePack?.loaders.length !== activePack?.loaders.length ||
        !activePackId ||
        polls > maxPolls
      ) {
        clearInterval(pollInterval)
        setAwaitingPackDeletion(false)
        polls = 0
      }
    }, delayMs)
  }, [awaitingPackDeletion, activePack, refetchActivePack])

  const handleDeleteSelected = async (selectedRows: Record<string, any>[]) => {
    try {
      await Promise.all(
        selectedRows.map(row => {
          return deleteLoader({
            loaderId: row.id,
            filePath: row.config.filePathOrUrl || '',
          })
        })
      )
      setRowSelection({})
      setAwaitingDeletionUpdate(true)
      enqueueSnackbar('Selected loaders deleted successfully.', {
        variant: 'success',
      })
    } catch (error) {
      enqueueSnackbar('Failed to delete selected loaders.', {
        variant: 'error',
      })
    }
  }

  const handleDeleteSingle = async (loaderId: string) => {
    try {
      const pack =
        activePack?.loaders.find((l: Loader) => l.id === loaderId) || {}

      await deleteLoader({
        loaderId,
        filePath: pack.config.filePathOrUrl || '',
      })

      setRowSelection(prev => {
        const newRowSelection = { ...prev }
        delete newRowSelection[loaderId]
        return newRowSelection
      })

      setAwaitingDeletionUpdate(true)
    } catch (error) {
      enqueueSnackbar('Failed to delete loader.', {
        variant: 'error',
      })
    }
  }

  const handleDeletePack = async (packId: string) => {
    try {
      await deletePack({ packId })
      setAwaitingPackDeletion(true)
      setActivePackId(null)
      enqueueSnackbar('Knowledge pack deleted successfully.', {
        variant: 'success',
      })
    } catch (error) {
      enqueueSnackbar('Failed to delete knowledge pack.', {
        variant: 'error',
      })
    }
  }

  const { mutateAsync: getApiKey } = client.useGenerateToken() as {
    mutateAsync: (arg: any) => Promise<{ token: string }>
  }

  const generateApiKey = async () => {
    const newApiKey = await getApiKey({
      noExpiresAt: true,
      owner: projectId,
      entity: projectId,
      agentId: currentAgentId,
    })

    setApiKey(newApiKey.token)
  }

  const copyApiKey = () => {
    if (!apiKey) return
    navigator.clipboard.writeText(apiKey)
    enqueueSnackbar('API key copied to clipboard', {
      variant: 'success',
    })

    // Highlight the input text
    const inputElement = document.querySelector(
      'input[value="' + apiKey + '"]'
    ) as HTMLInputElement
    if (inputElement) {
      inputElement.select()
    }
  }
  const columns: ColumnDef<Loader, unknown>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <span className="text-xs">{row.original.name}</span>,
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => <span className="text-xs">{row.original.type}</span>,
    },

    {
      accessorKey: 'config',
      header: 'Source',
      cell: ({ row }) => (
        <div className="max-w-[800px] overflow-x-auto">
          <div className="whitespace-nowrap">
            {JSON.stringify(row.original.config)}
          </div>
        </div>
      ),
    },

    {
      accessorKey: 'status',
      header: 'Status',
      // cell: ({ row }) => <span className="text-xs">{row.original.status}</span>,
      cell: ({ row }) => {
        switch (row.original.status) {
          case 'failed':
            return <Badge variant="destructive">{row.original.status}</Badge>
          case 'completed':
            return <Badge variant="secondary">{row.original.status}</Badge>
          case 'processing':
            return <Badge variant="outline">{row.original.status}</Badge>
          case 'pending':
            return <Badge variant="outline">{row.original.status}</Badge>
          default:
            return <Badge variant="outline">{row.original.status}</Badge>
        }
      },
    },

    {
      accessorKey: 'chunks',
      header: 'Chunks',
      cell: ({ row }) => (
        <Button
          onClick={() => {
            setActiveLoaderId(row.original.id)
            chunksDialogState[1](true)
          }}
          variant="outline"
          size="sm"
        >
          View
        </Button>
      ),
    },
  ]

  const renderRowActionMenu = (row: Row<Loader>) => (
    <DropdownMenuItem
      onClick={handleDeleteSingle.bind(null, row.original.id)}
      className="text-gray-700 hover:text-red-600 hover:bg-red-500  focus:bg-red-500 transition-colors duration-200"
    >
      Delete
    </DropdownMenuItem>
  )

  return (
    <WindowContainer>
      <CreateKnowledgePackDialog client={client} state={createDialogState} />
      <ChunksDialog
        state={chunksDialogState}
        client={client}
        loaderId={activeLoaderId}
        packId={activePackId}
      />
      <WindowHeader
        title={activePackId ? 'Knowledge Pack' : 'Knowledge'}
        description="Manage knowledge for your agent."
      />
      <div className="px-8">
        <div className="flex items-center justify-between">
          {!activePackId ? (
            <Tabs key="kp" className="w-full" defaultValue="yours">
              <TabsList className="">
                <TabsTrigger value="yours">Yours</TabsTrigger>
                <TabsTrigger disabled value="official">
                  Official
                </TabsTrigger>
              </TabsList>
              <TabsContent value="yours">
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">API Key</h3>
                  <div className="flex items-center space-x-2">
                    <Input
                      value={apiKey || ''}
                      readOnly
                      placeholder="Generate an API key"
                      className="flex-grow"
                    />
                    <Button onClick={generateApiKey} variant="outline">
                      Generate
                    </Button>
                    <Button
                      onClick={copyApiKey}
                      variant="outline"
                      disabled={!apiKey}
                    >
                      <CopyIcon className="mr-2 h-4 w-4" /> Copy
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <h2 className="text-xl font-semibold">Knowledge Packs</h2>
                  <Button
                    variant="portal-primary"
                    size="sm"
                    onClick={() => createDialogState[1](true)}
                  >
                    Create
                  </Button>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  {knowledgePacks?.map((pack, index) => (
                    <KnowledgePackCard
                      id={pack.id}
                      key={index}
                      title={pack.name || ''}
                      description={pack.description || ''}
                      model={'Model 1'}
                      created={pack.createdAt.toString()}
                      updated={pack.createdAt.toString()}
                      documents={10}
                      handleDeletePack={handleDeletePack}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <Tabs key={activePackId} className="w-full" defaultValue="view">
              <TabsList className="">
                <TabsTrigger value="view">View</TabsTrigger>
                <TabsTrigger value="add">Add</TabsTrigger>
              </TabsList>

              <TabsContent value="view">
                <DataTable<Loader, unknown>
                  // onDelete={handleDeleteSelected}
                  rowSelection={rowSelection}
                  setRowSelection={setRowSelection}
                  handleDeleteSelected={handleDeleteSelected}
                  renderRowActionMenu={renderRowActionMenu}
                  columns={columns}
                  data={activePack?.loaders ?? []}
                  filterInputPlaceholder="Search knowledge by id"
                  columnVisibilityButtonProps={{
                    children: 'Columns',
                  }}
                  paginationDivProps={{
                    className: 'flex items-center justify-end space-x-2 py-4',
                  }}
                  pageCountDivProps={{
                    className: 'flex-1 text-sm text-muted-foreground',
                  }}
                  previousButtonProps={{
                    variant: 'outline',
                    size: 'sm',
                    // onClick: () =>
                    //   setPage(prevPage => Math.max(prevPage - 1, 1)),
                    // disabled: page === 1,
                    children: 'Previous',
                  }}
                  // nextButtonProps={{
                  //   variant: 'outline',
                  //   size: 'sm',
                  //   onClick: () => {
                  //     if (
                  //       knowledge &&2
                  //       page < Math.ceil(knowledge.total / limit)
                  //     ) {
                  //       setPage(prevPage => prevPage + 1)
                  //     }
                  //   },
                  //   disabled:
                  //     knowledge && page >= Math.ceil(knowledge.total / limit),
                  //   children: 'Next',
                  // }}
                />

                <Button variant="outline" onClick={() => setActivePackId(null)}>
                  Back
                </Button>
              </TabsContent>

              <TabsContent value="add">
                <LoaderPicker
                  client={client}
                  setAwaitingUploadUpdate={setAwaitingUploadUpdate}
                />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </WindowContainer>
  )
}
