import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import { useEditor } from '../../workspaces/contexts/EditorProvider'
import { Layout } from '../../workspaces/contexts/LayoutProvider'
import { useLazyGetSpellQuery } from '../../state/api/spells'
import EventHandler from '../../screens/Magick/components/EventHandler'
import { debounce } from '../../utils/debounce'

import EditorWindow from './windows/EditorWindow/'
import Inspector from './windows/InspectorWindow'
import Playtest from './windows/PlaytestWindow'
import AvatarWindow from './windows/AvatarWindow'
import StateManager from '../../workspaces/spells/windows/StateManagerWindow'

import TextEditor from './windows/TextEditorWindow'
import DebugConsole from './windows/DebugConsole'

import { Spell, MagickComponent } from '@magickml/core'
import { usePubSub } from '../../contexts/PubSubProvider'
import EventManagerWindow from './windows/EventManager'
import { RootState } from '../../state/store'
import { useFeathers } from '../../contexts/FeathersProvider'
import { feathers as feathersFlag } from '../../config'
import EntityManagerWindow from '../agents/windows/EntityManagerWindow'
import React from 'react'

const Workspace = ({ tab, tabs, pubSub }) => {
  const spellRef = useRef<Spell>()
  const { events, publish } = usePubSub()
  const [loadSpell, { data: spellData }] = useLazyGetSpellQuery()
  const { editor, serialize, setDirtyGraph, getDirtyGraph } = useEditor()
  const FeathersContext = useFeathers()
  const client = FeathersContext?.client
  const preferences = useSelector((state: RootState) => state.preferences)

  // Set up autosave for the workspaces
  useEffect(() => {
    if (!editor?.on) return
    const unsubscribe = editor.on(
      // Comment events:  commentremoved commentcreated addcomment removecomment editcomment connectionpath
      'nodecreated noderemoved connectioncreated connectionremoved nodetranslated',
      debounce(async data => {
        if (!getDirtyGraph()) return
        if (tab.type === 'spell' && spellRef.current) {
          // setDirtyGraph(true)
          // publish(events.$SAVE_SPELL_DIFF(tab.id), { graph: serialize() })
        }
      }, 2000) // debounce for 2000 ms
    )

    return () => {
      unsubscribe()
    }
  }, [editor, preferences.autoSave])

  useEffect(() => {
    if (!editor?.on) return

    editor.on('nodecreated noderemoved', (node: any) => {
      if (!spellRef.current) return
      if (node.category !== 'I/O') return
      // TODO we can probably send this update to a spell namespace for this spell.
      // then spells can subscribe to only their dependency updates.
      const spell = {
        ...spellRef.current,
        graph: editor.toJSON(),
      }
      publish(events.$SUBSPELL_UPDATED(spellRef.current.name), spell)
    }) as unknown as Function
  }, [editor])

  useEffect(() => {
    if (!spellData) return
    spellRef.current = spellData
  }, [spellData])

  useEffect(() => {
    if (!tab || !tab.spellId) return
    loadSpell({
      spellId: tab.spellId,
    })
  }, [tab])

  useEffect(() => {
    if (!client || !feathersFlag) return
    ;(async () => {
      if (!client || !tab || !tab.spellId) return
      await client.service('spell-runner').get(tab.spellId)
    })()
  }, [client, feathersFlag])

  const factory = tab => {
    return node => {
      const props = {
        tab,
        node,
      }
      const component = node.getComponent()
      switch (component) {
        case 'stateManager':
          return <StateManager {...props} />
        case 'playtest':
          return <Playtest {...props} />
        case 'inspector':
          return <Inspector {...props} />
        case 'textEditor':
          return <TextEditor {...props} />
        case 'editorWindow':
          return <EditorWindow {...props} />
        case 'debugConsole':
          return <DebugConsole {...props} />
        case 'eventManager':
          return <EventManagerWindow {...props} />
        case 'entityManager':
          return <EntityManagerWindow />
        case 'avatar':
          return <AvatarWindow {...props} />
        default:
          return <p></p>
      }
    }
  }

  return (
    <>
      <EventHandler tab={tab} pubSub={pubSub} />
      <Layout json={tab.layoutJson} factory={factory(tab)} tab={tab} />
    </>
  )
}

const Wrapped = props => {
  return <Workspace {...props} />
}

export default React.memo(Wrapped, (prevProps, nextProps) => {
  return prevProps.tab.id !== nextProps.tab.id
})
