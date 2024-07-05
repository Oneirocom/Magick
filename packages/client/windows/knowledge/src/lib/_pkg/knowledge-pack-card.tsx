import React from 'react'
import { useAtom } from 'jotai'
import { activePackIdAtom } from './state'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@magickml/client-ui'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'

interface KnowledgePackCardProps {
  id: string
  title: string
  description: string
  model: string
  created: string
  updated: string
  documents: number
  handleDeletePack: (packId: string) => void
}

const KnowledgePackCard: React.FC<KnowledgePackCardProps> = ({
  id,
  title,
  description,
  created,
  handleDeletePack,
}) => {
  const [, setActive] = useAtom(activePackIdAtom)

  return (
    <Card className="flex flex-col gap-2 border border-gray-300 dark:border-gray-700 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>{title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem key="edit" onClick={() => setActive(id)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                key="delete"
                onClick={() => handleDeletePack(id)}
                className="text-gray-700 hover:text-red-600 hover:bg-red-500  focus:bg-red-500 transition-colors duration-200"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-1">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400">Model:</span>
            <span className="font-medium">{`text-embedding-3-small`}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400">Created:</span>
            <span className="font-medium">
              {new Date(created).toDateString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default KnowledgePackCard
