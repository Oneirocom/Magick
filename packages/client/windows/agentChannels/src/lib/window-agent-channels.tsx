import { useState } from 'react'
import {
  RootState,
  useDeleteChannelMutation,
  useGetChannelsQuery,
  useToggleChannelActiveMutation,
  // useGetChannelsQuery
} from 'client/state'
import { Checkbox, DataTable, DropdownMenuItem } from '@magickml/client-ui'
import { ColumnDef, Row } from '@tanstack/react-table'
import { WindowHeader, WindowContainer } from 'windows-shared'

import { useSnackbar } from 'notistack'
import { useSelector } from 'react-redux'

export const ChannelsWindow = () => {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)

  const globalConfig = useSelector((state: RootState) => state.globalConfig)
  const { currentAgentId } = globalConfig

  const { data: channels, refetch } = useGetChannelsQuery(
    { agentId: currentAgentId, limit, page },
    {
      skip: !currentAgentId,
    }
  )
  const [toggleChannelActive] = useToggleChannelActiveMutation()

  const [deleteChannel] = useDeleteChannelMutation()

  const { enqueueSnackbar } = useSnackbar()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleToggleChannel = async ({
    id,
    channelActive,
  }: {
    id: string
    channelActive: boolean
  }) => {
    await toggleChannelActive({ channelId: id, channelActive: !channelActive })
      .unwrap()
      .then(() => {
        enqueueSnackbar('Channel Active', { variant: 'success' })
      })
      .catch(() => {
        enqueueSnackbar('Error setting channel', { variant: 'error' })
      })
  }

  const handleDeleteChannel = async (channels: any[]) => {
    for (const channel of channels) {
      try {
        await deleteChannel({ channelId: channel.id }).unwrap()
      } catch (err) {
        console.error(err)
        enqueueSnackbar('Error deleting channel', { variant: 'error' })
      }
    }

    enqueueSnackbar('Channel(s) deleted', { variant: 'success' })
  }

  const renderRowActionMenu = (row: Row<any>) => {
    return (
      <>
        <DropdownMenuItem onClick={() => handleToggleChannel(row.original)}>
          Toggle Active
        </DropdownMenuItem>
      </>
    )
  }

  const columns: ColumnDef<any, unknown>[] = [
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
      accessorKey: 'channelName',
      header: 'Channel',
    },
    {
      accessorKey: 'channelKey',
      header: 'Key',
    },
    {
      accessorKey: 'channelActive',
      header: 'Active',
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
    },
    {
      accessorKey: 'updatedAt',
      header: 'Updated At',
    },
  ]

  return (
    <WindowContainer>
      <WindowHeader
        title="Channels"
        description="View and manage channels."
        cta="Refresh"
        ctaProps={{
          variant: 'portal-primary',
          onClick: refetch,
        }}
      />
      <div className="px-8">
        <DataTable<any, unknown>
          columns={columns}
          data={channels?.data || []}
          filterInputPlaceholder="Search channels..."
          onDelete={handleDeleteChannel}
          columnVisibilityButtonProps={{
            children: 'Columns',
          }}
          renderRowActionMenu={renderRowActionMenu}
          paginationDivProps={{
            className: 'flex items-center justify-end space-x-2 py-4',
          }}
          pageCountDivProps={{
            className: 'flex-1 text-sm text-muted-foreground',
          }}
          previousButtonProps={{
            variant: 'outline',
            size: 'sm',
            onClick: () => setPage(prevPage => Math.max(prevPage - 1, 1)),
            disabled: page === 1,
            children: 'Previous',
          }}
          nextButtonProps={{
            variant: 'outline',
            size: 'sm',
            onClick: () => {
              if (channels && page < Math.ceil(channels.length / limit)) {
                setPage(prevPage => prevPage + 1)
              }
            },
            disabled: channels && page >= Math.ceil(channels.length / limit),
            children: 'Next',
          }}
        />
      </div>
    </WindowContainer>
  )
}
