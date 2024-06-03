import { useGetSpellsQuery } from 'client/state'
import { useEffect, useState } from 'react'
import { SpellInterface } from 'server/schemas'
import { ConfigurationComponentProps } from './PropertiesWindow'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@magickml/client-ui'

export const SelectSpell: React.FC<ConfigurationComponentProps> = props => {
  const { data: spellData } = useGetSpellsQuery({})
  const [spells, setSpells] = useState<SpellInterface[]>([])
  const [spellId, setSpellId] = useState<string>(props.fullConfig.spellId || '')

  useEffect(() => {
    if (spellData) {
      setSpells(
        spellData.data.filter(
          (spell: SpellInterface) => spell.id !== props.spell.id
        )
      )
    }
  }, [spellData])

  const onSelectSpell = (spellId: string) => {
    setSpellId(spellId)
    console.log('spellId', spellId)
    props.updateConfigKey('spellId', spellId)
  }

  return (
    <>
      <Select
        value={spellId}
        onValueChange={(newValue: string) => onSelectSpell(newValue)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Provider" />
        </SelectTrigger>
        <SelectContent>
          {spells.map(spell => {
            return (
              <SelectItem key={spell.id} value={spell.id}>
                {spell.name}
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </>
  )
}
