// @ts-ignore
import { spells } from '#spells-virtual/spells'

import type { Spell } from '../types'

interface ScannedSpell {
  path: string
  data: Spell
  name: string
}

export const getVirtualSpells = (): ScannedSpell[] => spells
