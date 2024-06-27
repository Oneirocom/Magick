import {
  TabsContent,
  InputWithLabel,
  SelectWithLabel,
} from '@magickml/client-ui'

import { KnowledgeDialogTab } from './types'
import { useAtom } from 'jotai'
import { addKnowledgeFormAtom } from './state'

import { DataType } from '@magickml/shared-services'

type KnowledgeURLContentProps = {
  disabledState: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
}

export const KnowledgeURLContent: React.FC<KnowledgeURLContentProps> = () => {
  const dataTypes = Object.values(DataType).map(type => ({
    label: type,
    value: type,
  }))

  const [formKnowledge, setFormKnowledge] = useAtom(addKnowledgeFormAtom)

  return (
    <TabsContent
      value={KnowledgeDialogTab.URL}
      className="flex flex-col gap-y-4 pt-2"
    >
      <InputWithLabel
        id="name"
        label="Name"
        placeholder="Enter a name for this new knowledge entry"
        className="w-full"
        value={formKnowledge.name}
        onChange={e =>
          setFormKnowledge({ ...formKnowledge, name: e.target.value })
        }
        required
      />
      <InputWithLabel
        id="sourceUrl"
        label="Source URL"
        placeholder="Enter a source URL to download the knowledge from"
        className="w-full"
        value={formKnowledge.sourceUrl}
        onChange={e =>
          setFormKnowledge({ ...formKnowledge, sourceUrl: e.target.value })
        }
      />

      <div className="grid grid-cols-2 gap-x-2">
        <InputWithLabel
          id="tag"
          label="Tag"
          placeholder="Enter a tag"
          value={formKnowledge.tag}
          onChange={e =>
            setFormKnowledge({ ...formKnowledge, tag: e.target.value })
          }
        />
        <SelectWithLabel
          id="dataType"
          label="Data Type"
          className="w-full"
          options={dataTypes}
          group="Data Type"
          value={formKnowledge.dataType}
          onValueChange={(value: string) =>
            setFormKnowledge({ ...formKnowledge, dataType: value })
          }
          required
        />
      </div>
    </TabsContent>
  )
}
