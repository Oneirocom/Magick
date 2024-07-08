import { useFeathers, usePubSub } from '@magickml/providers'
import { CoreNode, CoreNodeProps } from '../node/core-node'
import { useCallback, useEffect, useState, useRef } from 'react'
import { SpellInterface } from '@magickml/agent-server-schemas'
import { useChangeNodeData } from '../hooks'
import { useReactFlow } from '@xyflow/react'
import { isEqual } from 'lodash'

type Props = CoreNodeProps & {}

export const SubspellOutputNode: React.FC<Props> = ({
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
    (keys: Record<string, any>, socketInputs: any[]) => {
      const newConfig = {
        ...data.configuration,
        ...keys,
      }

      // Compare the new configuration with the previous configuration
      if (!isEqual(newConfig, prevConfigRef.current)) {
        handleChange('configuration', newConfig)
        prevConfigRef.current = newConfig

        // Identify and remove edges connected to removed sockets
        const existingSockets = new Set(socketInputs?.map(input => input.name))
        const edges = instance?.getEdges()

        const newEdges = edges.filter(edge => {
          return !(
            edge.target === id &&
            !existingSockets.has(edge.targetHandle as string)
          )
        })

        // Update the edges in the instance
        instance.setEdges(newEdges)
      }
    },
    [data.configuration]
  )
  const formatUpdate = (spell: SpellInterface) => {
    // For the output node, we want to turn the graphs Outputs into inputs on the output node.
    const socketInputs =
      spell?.graph?.graphOutputs?.map(output => {
        return {
          name: output.key,
          ...output,
        }
      }) || []

    const updates = {
      ...(spell.graph.graphOutputs ? { socketInputs } : {}),
      // ensure this node never has outputs to it since it is an ending event
      socketOutputs: [],
    }

    return { updates, socketInputs }
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
        const { updates, socketInputs } = formatUpdate(updatedSpell)
        updateConfigKeys(updates, socketInputs)
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
