import { ColumnDef } from '@tanstack/react-table'
import { CaretSortIcon, DotsHorizontalIcon } from '@radix-ui/react-icons'
import {
  Button,
  buttonVariants,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../core/ui'

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

const ButtonHeader = ({ column, name }: { column: any; name: string }) => {
  return (
    <div
      className={buttonVariants({
        variant: 'ghost',
      })}
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      {name}
      <CaretSortIcon className="ml-2 h-4 w-4" />
    </div>
  )
}

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
    header: ({ column }) => <ButtonHeader column={column} name="Name" />,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'serviceType',
    header: ({ column }) => <ButtonHeader column={column} name="Type" />,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'description',
    header: 'Description',
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => <ButtonHeader column={column} name="Created" />,
    enableSorting: true,
    enableHiding: true,
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
