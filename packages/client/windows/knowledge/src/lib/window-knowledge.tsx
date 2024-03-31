import React, { useState } from 'react'
import { useGetKnowledgeQuery } from 'client/state'
import { LoadingScreen } from 'client/core'
import {
  Button,
  Checkbox,
  DataTable,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@magickml/client-ui'
import { CaretSortIcon } from '@radix-ui/react-icons'
import { ColumnDef, Row } from '@tanstack/react-table'
import { WindowHeader, WindowContainer } from 'windows-shared'
import type { KnowledgeItem } from 'client/state'
import { AddKnowledgeDialog } from './dialogs/knowledge-add-dialog'

type Props = {}

export const KnowledgeWindow = (props: Props) => {
  const [addOpen, setAddOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const { data: knowledge, isLoading } = useGetKnowledgeQuery({
    limit,
    skip: (page - 1) * limit,
  })

  const columns: ColumnDef<KnowledgeItem, unknown>[] = [
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
      accessorKey: 'dataType',
      header: 'Type',
      cell: ({ row }) => (
        <span className="text-xs">{row.original.dataType}</span>
      ),
    },
    {
      accessorKey: 'sourceUrl',
      header: 'Source URL',
      size: 48,
      maxSize: 48,
      cell: ({ row }) => (
        <span className="text-xs">
          {row.original.sourceUrl ? row.original.sourceUrl : 'N/A'}
        </span>
      ),
    },

    {
      accessorKey: 'data',
      header: 'Data',
      cell: ({ row }) => (
        <span className="text-xs">
          {row.original.data ? row.original.data : 'N/A'}
        </span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row }) => (
        <span className="text-xs">
          {row.original.createdAt ? new Date().toLocaleDateString() : 'N/A'}
        </span>
      ),
    },
    {
      accessorKey: 'updatedAt',
      header: 'Updated At',
      cell: ({ row }) => (
        <span className="text-xs">
          {row.original.updatedAt ? new Date().toLocaleDateString() : 'N/A'}
        </span>
      ),
    },
  ]

  const renderRowActionMenu = (row: Row<KnowledgeItem>) => (
    <>
      <DropdownMenuItem
        onClick={() => console.log('View knowledge:', row.original)}
      >
        View Knowledge
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => console.log('Edit knowledge:', row.original)}
      >
        Edit Knowledge
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={() => console.log('Delete knowledge:', row.original)}
      >
        Delete Knowledge
      </DropdownMenuItem>
    </>
  )

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <>
      <AddKnowledgeDialog isOpen={addOpen} setIsOpen={setAddOpen} />

      <WindowContainer>
        <WindowHeader
          title="Knowledge"
          description="Manage knowledge for your agent."
          cta="Add Knowledge"
          ctaProps={{
            variant: 'portal-primary',
            onClick: () => setAddOpen(true),
          }}
        />
        <div className="px-8">
          <DataTable<KnowledgeItem, unknown>
            columns={columns}
            data={knowledge?.data ?? []}
            filterInputPlaceholder="Search knowledge by id"
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
                if (knowledge && page < Math.ceil(knowledge.total / limit)) {
                  setPage(prevPage => prevPage + 1)
                }
              },
              disabled: knowledge && page >= Math.ceil(knowledge.total / limit),
              children: 'Next',
            }}
          />
        </div>
      </WindowContainer>
    </>
  )
}
