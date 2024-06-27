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
} from '@magickml/client-ui'
import { createEmbedderReactClient } from '@magickml/embedder-client-react'
import { useAtom } from 'jotai'
import { WindowContainer, WindowHeader } from 'windows-shared'
import { LoaderPicker } from './loader-picker'
import KnowledgePackCard from '../_pkg/knowledge-pack-card'
import { CreateKnowledgePackDialog } from '../_pkg/create-pack'
import { activePackIdAtom } from '../_pkg/state'
import { Loader } from '@magickml/embedder-schema'
import { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'
import { useConfig } from '@magickml/providers'
import { ChunksDialog } from '../_pkg/chunks-dialog'

type KnowledgeWindowProps = {}
export const KnowledgeWindow: React.FC<KnowledgeWindowProps> = () => {
  const token = useConfig().embedderToken
  const createDialogState = useState(false)
  const chunksDialogState = useState(false)
  const client = createEmbedderReactClient({
    tsqPrefix: 'embedder',
    baseUrl:
      process.env.NEXT_PUBLIC_EMBEDDER_SERVER_URL ||
      'http://localhost:3000/api',
    options: {
      axiosConfig: {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    },
  })

  const { data: knowledgePacks } = client.useGetPacksByEntityAndOwner()

  const [activePackId, setActivePackId] = useAtom(activePackIdAtom)
  const [activeLoaderId, setActiveLoaderId] = useState<string | null>(null)

  const { data: activePack } = client.useFindPack(
    {
      params: {
        id: activePackId || '',
      },
    },
    {
      enabled: !!activePackId,
    }
  )

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

    // {
    //   accessorKey: 'sourceUrl',
    //   header: 'Source URL',
    //   size: 48,
    //   maxSize: 48,
    //   cell: ({ row }) => (
    //     <span className="text-xs">
    //       {row.original.sourceUrl ? row.original.sourceUrl : 'N/A'}
    //     </span>
    //   ),
    // },

    {
      accessorKey: 'config',
      header: 'Source',
      cell: ({ row }) => (
        <span className="text-xs">{JSON.stringify(row.original.config)}</span>
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
                  columns={columns}
                  data={activePack?.loaders ?? []}
                  filterInputPlaceholder="Search knowledge by id"
                  columnVisibilityButtonProps={{
                    children: 'Columns',
                  }}
                  renderRowActionMenu={() => null}
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
                <LoaderPicker client={client} />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </WindowContainer>
  )
}
