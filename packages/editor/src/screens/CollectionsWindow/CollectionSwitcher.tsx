import { FunctionComponent, useState } from 'react'
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from '@radix-ui/react-icons'

import { cn } from '@magickml/ui/utils'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@magickml/ui'

type Collection = {
  id: string
  name: string
}

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface CollectionSwitcherProps extends PopoverTriggerProps {
  collections: Collection[]
  activeCollection: Collection
  onCollectionChange: (collectionId: string) => void
  onDialogSubmit: () => void
  dialogContent: React.ReactNode
  dialogTitle: string
  dialogDescription: string
}

const CollectionSwitcher: FunctionComponent<CollectionSwitcherProps> = ({
  className,
  collections,
  activeCollection,
  onCollectionChange,
  onDialogSubmit,
  dialogContent,
  dialogTitle,
  dialogDescription,
  ...props
}) => {
  const [open, setOpen] = useState(false)
  const [showCollectionDialog, setShowCollectionDialog] = useState(false)

  return (
    <Dialog open={showCollectionDialog} onOpenChange={setShowCollectionDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a team"
            className={cn('w-[200px] justify-between', className)}
          >
            {activeCollection.name}
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput
                className="border-transparent outline-trasparent"
                placeholder="Search collection..."
              />
              <CommandEmpty>No collections found.</CommandEmpty>
              {collections?.map(collection => (
                <CommandItem
                  onSelect={() => {
                    onCollectionChange(collection.id)
                    setOpen(false)
                  }}
                  key={collection.id}
                  className="text-sm"
                >
                  {collection.name}
                  <CheckIcon
                    className={cn(
                      'ml-auto h-4 w-4',
                      activeCollection.id === collection.id
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false)
                      setShowCollectionDialog(true)
                    }}
                  >
                    <PlusCircledIcon className="mr-2 h-5 w-5" />
                    Create Collection
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent className="bg-black">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <div>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">{dialogContent}</div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setShowCollectionDialog(false)
              setOpen(false)
            }}
          >
            Cancel
          </Button>

          <Button
            className="primary"
            variant="default"
            onClick={() => {
              onDialogSubmit()
              setShowCollectionDialog(false)
              setOpen(false)
            }}
            type="submit"
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CollectionSwitcher
