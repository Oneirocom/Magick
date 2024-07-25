import { useGetSpellsQuery } from 'client/state'
import { useEffect, useState } from 'react'
import { SpellInterface } from '@magickml/agent-server-schemas'
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
  const [spellName, setSpellName] = useState<string>(
    props.fullConfig.spellName || ''
  )

  useEffect(() => {
    if (spellData) {
      setSpells(
        spellData.data.filter(
          (spell: SpellInterface) => spell.id !== props.spell.id
        )
      )
    }
  }, [spellData])

  const onSelectSpell = (spellName: string) => {
    setSpellName(spellName)
    props.updateConfigKey('spellName', spellName)
  }

  return (
    <>
      <Select
        value={spellName}
        onValueChange={(newValue: string) => onSelectSpell(newValue)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Provider" />
        </SelectTrigger>
        <SelectContent>
          {spells.map(spell => {
            return (
              <SelectItem key={spell.name} value={spell.name}>
                {spell.name}
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </>
  )
}
