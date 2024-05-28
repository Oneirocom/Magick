import { useState } from 'react'
import {
  RootState,
  // useGetChannelsQuery
} from 'client/state'
import { Checkbox, DataTable, DropdownMenuItem } from '@magickml/client-ui'
import { ColumnDef, Row } from '@tanstack/react-table'
import { WindowHeader, WindowContainer } from 'windows-shared'

import { useSnackbar } from 'notistack'
import { useSelector } from 'react-redux'

export const ChannelsWindow = () => {
  const [page, setPage] = useState(1)
  // const [limit] = useState(10)

  const globalConfig = useSelector((state: RootState) => state.globalConfig)
  const { currentAgentId } = globalConfig
  console.log('currentAgentId', currentAgentId)
  // const { data: channels, refetch } = useGetChannelsQuery(currentAgentId, {
  //   skip: !currentAgentId,
  // })

  const { enqueueSnackbar } = useSnackbar()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleToggleChannel = async (channelId: string) => {
    enqueueSnackbar('Channel Active', { variant: 'success' })
  }

  const renderRowActionMenu = (row: Row<any>) => {
    return (
      <>
        <DropdownMenuItem onClick={() => handleToggleChannel(row.original.id)}>
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
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'type',
      header: 'Type',
    },
    {
      accessorKey: 'created_at',
      header: 'Created At',
    },
    {
      accessorKey: 'updated_at',
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
          // onClick: refetch,
        }}
      />
      <div className="px-8">
        <DataTable<any, unknown>
          columns={columns}
          data={[]}
          filterInputPlaceholder="Search channels..."
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
              // if (channels && page < Math.ceil(channels.length / limit)) {
              //   setPage(prevPage => prevPage + 1)
              // }
            },
            // disabled: channels && page >= Math.ceil(channels.length / limit),
            children: 'Next',
          }}
        />
      </div>
    </WindowContainer>
  )
}
