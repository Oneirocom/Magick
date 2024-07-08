import { useFeathers, usePubSub } from '@magickml/providers'
import { CoreNode, CoreNodeProps } from '../node/core-node'
import { useCallback, useEffect, useRef, useState } from 'react'
import { SpellInterface } from '@magickml/agent-server-schemas'
import { useChangeNodeData } from '../hooks'
import { isEqual } from 'lodash'

type Props = CoreNodeProps & {}

export const SubspellNode: React.FC<Props> = ({
  spec,
  allSpecs,
  spellId,
  ...props
}) => {
  const { client } = useFeathers()
  const [spell, setSpell] = useState<SpellInterface | null>(null)
  const {
    subscribe,
    events: { $SUBSPELL_UPDATED },
  } = usePubSub()
  const { data, id } = props

  const prevConfigRef = useRef(data.configuration)
  const handleChange = useChangeNodeData(id)

  const updateConfigKeys = useCallback(
    (keys: Record<string, any>) => {
      const newConfig = {
        ...data.configuration,
        ...keys,
      }

      // Compare the new configuration with the previous configuration
      if (!isEqual(newConfig, prevConfigRef.current)) {
        handleChange('configuration', newConfig)
        prevConfigRef.current = newConfig
      }
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

    const handler = (eventName: string, spell: SpellInterface) => {
      if (spell.id !== data.configuration.spellId) return

      const updates = formatUpdate(spell)

      updateConfigKeys(updates)
    }

    const unsubscribe = subscribe($SUBSPELL_UPDATED(spell.id), handler)

    return () => {
      unsubscribe()
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
