import { useFeathers, usePubSub } from '@magickml/providers'
import { CoreNode, CoreNodeProps } from '../node/core-node'
import { useCallback, useEffect, useState, useRef } from 'react'
import { SpellInterface } from 'server/schemas'
import { useChangeNodeData } from '../hooks'
import { useReactFlow } from '@xyflow/react'
import { isEqual } from 'lodash'

type Props = CoreNodeProps & {}

export const SubspellInputNode: React.FC<Props> = ({
  spec,
  allSpecs,
  spellId,
  ...props
}) => {
  const { client } = useFeathers()
  const [spell, setSpell] = useState<SpellInterface | null>(null)
  const instance = useReactFlow()

  const {
    subscribe,
    events: { $SUBSPELL_UPDATED },
  } = usePubSub()

  const { data, id } = props
  const prevConfigRef = useRef(data.configuration)

  const handleChange = useChangeNodeData(id)

  const updateConfigKeys = useCallback(
    (keys: Record<string, any>, socketOutputs: any[]) => {
      const newConfig = {
        ...data.configuration,
        ...keys,
      }

      // Compare the new configuration with the previous configuration
      if (!isEqual(newConfig, prevConfigRef.current)) {
        handleChange('configuration', newConfig)
        prevConfigRef.current = newConfig

        // // Identify and remove edges connected to removed sockets
        const existingSockets = new Set(socketOutputs?.map(input => input.name))
        const edges = instance?.getEdges()

        const newEdges = edges.filter(edge => {
          return !(
            edge.source === id &&
            !existingSockets.has(edge.sourceHandle as string)
          )
        })

        // Update the edges in the instance
        instance.setEdges(newEdges)
      }
    },
    [data.configuration]
  )
  const formatUpdate = (spell: SpellInterface) => {
    // This is a bit odd, but we want to turn the graphs Inputs into outputs on the input node.
    const socketOutputs =
      spell?.graph?.graphInputs?.map(input => {
        return {
          name: input.key,
          ...input,
        }
      }) || []

    const updates = {
      ...(spell.graph.graphInputs ? { socketOutputs } : {}),
      // ensure this node never has inputs to it since it is a starting event
      socketInputs: [],
    }

    return { updates, socketOutputs }
  }

  useEffect(() => {
    if (!spellId) return
    if (spell?.id === spellId) return
    ;(async () => {
      const spell = await client.service('spells').get(spellId)

      setSpell(spell)
    })()
  }, [spellId])

  useEffect(() => {
    if (!spell || !client || !spellId) return

    const handler = (eventName: string, updatedSpell: SpellInterface) => {
      if (updatedSpell.id !== spellId) return

      // Check if the updated spell data is different from the current spell data
      if (!isEqual(updatedSpell, spell)) {
        const { updates, socketOutputs } = formatUpdate(updatedSpell)
        updateConfigKeys(updates, socketOutputs)
        setSpell(updatedSpell) // Update the spell state with the new data
      }
    }

    // Subscribe to the $SUBSPELL_UPDATED event
    const unsubscribe = subscribe($SUBSPELL_UPDATED(spell.id), handler)

    return () => {
      unsubscribe()
    }
  }, [spell, client, spellId])

  return (
    <>
      <CoreNode spec={spec} allSpecs={allSpecs} spellId={spellId} {...props} />
    </>
  )
}
