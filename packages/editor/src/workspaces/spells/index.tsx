import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import { useEditor } from '../contexts/EditorProvider'
import { Layout } from '../contexts/LayoutProvider'
import { getSpellApi } from '../../state/api/spells'
import EventHandler from '../../screens/Magick/components/EventHandler'
import { debounce } from '../../utils/debounce'
import { useConfig } from '../../contexts/ConfigProvider'

import EditorWindow from './windows/EditorWindow'
import Inspector from './windows/InspectorWindow'
import Playtest from './windows/PlaytestWindow'
import AvatarWindow from './windows/AvatarWindow'

import TextEditor from './windows/TextEditorWindow'
import DebugConsole from './windows/DebugConsole'

import { Spell } from '@magickml/engine'
import { usePubSub } from '../../contexts/PubSubProvider'
import { RootState } from '../../state/store'
import { useFeathers } from '../../contexts/FeathersProvider'
import React from 'react'

const Workspace = ({ tab, tabs, pubSub }) => {
  const config = useConfig()
  const spellApi = getSpellApi(config)

  const spellRef = useRef<Spell>()
  const { events, publish } = usePubSub()
  const [loadSpell, { data: spellData }] = spellApi.useLazyGetSpellByIdQuery()
  const { editor, serialize } = useEditor()
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
        if (tab.type === 'spell' && spellRef.current) {
          publish(events.$SAVE_SPELL_DIFF(tab.id), { graph: serialize() })
        }
      }, 1000) // debounce for 2000 ms
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
    spellRef.current = spellData.data[0]
  }, [spellData])

  useEffect(() => {
    if (!tab || !tab.spellName) return
    console.log("Inside Load Spell !!")
    loadSpell({
      spellName: "sdbot",
      projectId: config.projectId,
      Id: tab.id,
    })
  }, [tab])

  useEffect(() => {
    if (!client) return
    ;(async () => {
      if (!client || !tab || !tab.spellName) return
      console.log('projectId from client ', config.projectId)
      // make sure to pass the projectId to the service call
      await client.service('spell-runner').get(tab.spellName,
        {
          query: {
            projectId: config.projectId,
          },
        }
      )
    })()
  }, [client])

  const factory = tab => {
    return node => {
      const props = {
        tab,
        node,
      }
      const component = node.getComponent()
      switch (component) {
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
