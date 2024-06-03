import { useFeathers } from '@magickml/providers'
import { CoreNode, CoreNodeProps } from '../node/core-node'
import { useCallback, useEffect, useState } from 'react'
import { SpellInterface } from 'server/schemas'
import { useChangeNodeData } from '../hooks'
import { GraphJSON } from '@magickml/behave-graph'

type Props = CoreNodeProps & {}

export const SubspellNode: React.FC<Props> = ({
  spec,
  allSpecs,
  spellId,
  ...props
}) => {
  const { client } = useFeathers()
  const [spell, setSpell] = useState<SpellInterface | null>(null)
  const { data, id } = props

  const handleChange = useChangeNodeData(id)

  const updateConfigKeys = useCallback(
    (keys: Record<string, any>) => {
      const newConfig = {
        ...data.configuration,
        ...keys,
      }
      handleChange('configuration', newConfig)
    },
    [data.configuration]
  )

  const formatUpdate = (spell: SpellInterface) => {
    const socketInputs = spell?.graph?.graphInputs?.map(input => {
      return {
        name: input.key,
        ...input,
      }
    })

    const socketOutputs = spell?.graph?.graphOutputs?.map(output => {
      return {
        name: output.key,
        ...output,
      }
    })

    const updates = {
      ...(spell.graph.graphInputs ? { socketInputs } : {}),
      ...(spell.graph.graphOutputs ? { socketOutputs } : {}),
    }

    return updates
  }

  useEffect(() => {
    if (!data.configuration) return
    if (!data.configuration.spellId) return
    if (data.configuration.spellId === spell?.id) return
    ;(async () => {
      const spell = await client
        .service('spells')
        .get(data.configuration.spellId)

      setSpell(spell)
    })()
  }, [data.configuration])

  useEffect(() => {
    if (!spell || !client) return

    console.log('SETTING UP HANDLER')

    const handler = (spell: SpellInterface) => {
      console.log('subspell updated', spell)
      if (spell.id !== data.configuration.spellId) return

      const updates = formatUpdate(spell)

      updateConfigKeys(updates)
    }

    client.service('spells').on('patched', handler)
    client.service('spells').on('updated', handler)

    return () => {
      client.service('spells').removeListener('patched', handler)
      client.service('spells').removeListener('updated', handler)
    }
  }, [spell, client])

  useEffect(() => {
    if (!spell) return

    const updates = formatUpdate(spell)

    updateConfigKeys(updates)

    // probably need to handle disconnecting connected sdges if things change
  }, [spell])

  return (
    <>
      <CoreNode spec={spec} allSpecs={allSpecs} spellId={spellId} {...props} />
    </>
  )
}
