import { spellRegistry } from './registry'
import type { Spell, SerializedSpell } from '../../types'
import { writeGraphToJSON, readGraphFromJSON } from '@magickml/behave-graph'
import fs from 'fs/promises'
import path from 'path'
import { useRuntimeConfig } from 'nitro/runtime'

// NOTE: These paths need to be tested out. We should to seperate off utils that are used in runtime and the module.
// The module will exist in the users node_modules folder so its a bit different.
// TODO: look for unjs approved way to handle json imports if there is one
// UPDATE: confbox and destr

export async function serializeSpell(spell: Spell): Promise<SerializedSpell> {
  return {
    ...spell,
    graph: writeGraphToJSON(spell.graph, useRuntimeConfig().registry),
  }
}

export async function deserializeSpell(
  serializedSpell: SerializedSpell
): Promise<Spell> {
  return {
    ...serializedSpell,
    graph: readGraphFromJSON({
      graphJson: serializedSpell.graph,
      registry: useRuntimeConfig().registry,
    }),
  }
}

export async function saveSpellToFile(
  spell: Spell,
  directory: string
): Promise<void> {
  const serializedSpell = await serializeSpell(spell)
  const filePath = path.join(directory, `${spell.id}.json`)
  await fs.writeFile(filePath, JSON.stringify(serializedSpell, null, 2))
}

export async function loadSpellFromFile(filePath: string): Promise<Spell> {
  const content = await fs.readFile(filePath, 'utf-8')
  const serializedSpell: SerializedSpell = JSON.parse(content)
  return deserializeSpell(serializedSpell)
}

export function getSpell(id: string): Spell | undefined {
  return spellRegistry.get(id)
}

export function getAllSpells(): Spell[] {
  return spellRegistry.getAll()
}

export function addSpell(spell: Spell): void {
  spellRegistry.add(spell)
}

export function removeSpell(id: string): void {
  spellRegistry.remove(id)
}

export function updateSpell(id: string, spellUpdate: Partial<Spell>): void {
  spellRegistry.update(id, spellUpdate)
}
