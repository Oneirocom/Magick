import { ColumnDef } from '@tanstack/react-table'
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from '@radix-ui/react-icons'
import { Button } from '../../ui/button'
import { Checkbox } from '../../ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu'

export type Credential = {
  id: string
  projectId: string
  name: string
  serviceType: string
  credentialType: string
  description: null | string
  created_at: string
  updated_at: string
}

import { useConfig } from '@magickml/providers'
import { useDeleteCredentialMutation } from 'client/state'

export const columns: ColumnDef<Credential>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        // @ts-ignore
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
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
    accessorKey: 'serviceType',
    header: 'Service Type',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const credential = row.original
      const { projectId } = useConfig()
      const [deleteCredential] = useDeleteCredentialMutation()

      const handleDelete = async () => {
        await deleteCredential({ credentialId: credential.id, projectId })
      }
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(credential.name)}
            >
              Copy Name
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
