import { useState } from 'react'
import { useDeleteEventsMutation, useGetEventsQuery } from 'client/state'
// import { LoadingScreen } from 'client/core'
import {
  Checkbox,
  DataTable,
  DropdownMenuItem,
  // DropdownMenuSeparator,
} from '@magickml/client-ui'
import { ColumnDef, Row } from '@tanstack/react-table'
import { WindowHeader, WindowContainer } from 'windows-shared'
import type { RootState } from 'client/state'
import { useSnackbar } from 'notistack'
import { useSelector } from 'react-redux'

export const EventsWindow = () => {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)

  const globalConfig = useSelector((state: RootState) => state.globalConfig)
  const { currentAgentId } = globalConfig
  const {
    data: events,
    // isLoading,
    refetch,
  } = useGetEventsQuery(currentAgentId, {
    // limit,
    // skip: (page - 1) * limit,
    skip: !currentAgentId,
  })

  // const openState = useState(false)

  const [deleteEvents] = useDeleteEventsMutation()
  const { enqueueSnackbar } = useSnackbar()

  const handleEventsDelete = async (eventsId: string) => {
    try {
      await deleteEvents({ eventsId }).unwrap()
      enqueueSnackbar('Events deleted', { variant: 'success' })
    } catch (error) {
      enqueueSnackbar('Error deleting events', { variant: 'error' })
    }
  }

  const renderRowActionMenu = (
    row: Row<any> // todo: events rtk has no types :/
  ) => (
    <>
      <DropdownMenuItem onClick={() => handleEventsDelete(row.original.id)}>
        Delete Events
      </DropdownMenuItem>
    </>
  )

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
      accessorKey: 'client',
      header: 'Client',
    },
    {
      accessorKey: 'sender',
      header: 'Sender',
    },
    {
      accessorKey: 'content',
      header: 'Content',
    },
    {
      accessorKey: 'type',
      header: 'Type',
    },
    {
      accessorKey: 'channel',
      header: 'Channel',
    },
    {
      accessorKey: 'observer',
      header: 'Observer',
    },
    {
      accessorKey: 'date',
      header: 'Date',
    },
  ]

  return (
    <WindowContainer>
      <WindowHeader
        title="Events"
        description="View and manage events."
        cta="Refresh"
        ctaProps={{
          variant: 'portal-primary',
          onClick: refetch,
        }}
      />
      <div className="px-8">
        <DataTable<any, unknown>
          columns={columns}
          data={events ?? []}
          filterInputPlaceholder="Search events..."
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
              if (events && page < Math.ceil(events.length / limit)) {
                setPage(prevPage => prevPage + 1)
              }
            },
            disabled: events && page >= Math.ceil(events.length / limit),
            children: 'Next',
          }}
          // bulkActionsProps={{
          //   deleteSelectedRows: selectedRows =>
          //     handleDeleteMany(selectedRows.map(row => row.original.row.id)),
          //   deleteAllLabel: 'Delete selected events',
          // }}
        />
      </div>
    </WindowContainer>
  )
}
