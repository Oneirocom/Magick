import { useGetDocumentsQuery } from 'client/state'
import { useEffect, useState } from 'react'

interface Document {
  id: string
  content: string
}

type Props = {
  addNewItemWithoutDuplication: (
    id: string,
    index: number,
    content: string,
    type: string
  ) => void
}

export const handleDocumentsHook = ({
  addNewItemWithoutDuplication,
}: Props) => {
  const { data: fetchedDocuments } = useGetDocumentsQuery({})
  const [documents, setDocuments] = useState<Document[] | null>(null)

  useEffect(() => {
    if (!fetchedDocuments) return
    if (!fetchedDocuments.data.length) return

    setDocuments(fetchedDocuments.data)

    useEffect(() => {
      if (!documents || !documents.length) return

      documents.forEach(doc => {
        addNewItemWithoutDuplication(doc?.id, 3, '', 'txt')
      })
    }, [documents])
  }, [fetchedDocuments])

  return {
    documents,
  }
}
