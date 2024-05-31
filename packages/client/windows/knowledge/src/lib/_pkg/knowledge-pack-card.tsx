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
} from '@magickml/client-ui'

interface KnowledgePackCardProps {
  id: string
  title: string
  description: string
  model: string
  created: string
  updated: string
  documents: number
}

const KnowledgePackCard: React.FC<KnowledgePackCardProps> = ({
  id,
  title,
  description,
  created,
}) => {
  const [, setActive] = useAtom(activePackIdAtom)

  return (
    <Card className="flex flex-col gap-2 border border-gray-300 dark:border-gray-700 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="w-full inline-flex items-center justify-between">
          {title}
          <Button
            variant="outline"
            className="ml-auto"
            onClick={() => setActive(id)}
          >
            Edit
          </Button>
        </CardTitle>
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
