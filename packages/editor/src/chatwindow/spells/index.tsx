import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import { useEditor } from '../contexts/EditorProvider'
import { Layout } from '../contexts/LayoutProvider'
import { spellApi } from '../../state/api/spells'
import EventHandler from '../../screens/Chat/components/EventHandler'
import { debounce } from '../../utils/debounce'
import { useConfig } from '../../contexts/ConfigProvider'

import ChatWindow from './windows/ChatWindow'

import { Spell } from '@magickml/engine'
import { usePubSub } from '../../contexts/PubSubProvider'
import { RootState } from '../../state/store'
import { useFeathers } from '../../contexts/FeathersProvider'
import React from 'react'

const Chatwindow = ({ tab, tabs, pubSub }) => {
    const config = useConfig()
    const spellRef = useRef<Spell>()
    const { events, publish } = usePubSub()
    const [loadSpell, { data: spellData }] = spellApi.useLazyGetSpellByIdQuery()
    const { editor, serialize } = useEditor()
    const FeathersContext = useFeathers()
    const client = FeathersContext?.client
    const preferences = useSelector((state: RootState) => state.preferences)

    // Set up autosave for the chatwindow
    useEffect(() => {
        if (!editor?.on) return
        const unsubscribe = editor.on(
            // Comment events:  commentremoved commentcreated addcomment removecomment editcomment connectionpath
            'nodecreated noderemoved connectioncreated connectionremoved nodetranslated',
            debounce(async data => {

                if (tab.type === 'spell' && spellRef.current) {
                    publish(events.$SAVE_SPELL_DIFF(tab.id), { graph: serialize() })
                }
            }, 5000) // debounce for 2000 ms
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
            publish(events.$SUBSPELL_UPDATED(spellRef.current.id), spell)
        }) as unknown as Function
    }, [editor])

    useEffect(() => {
        if (!spellData) return
        spellRef.current = spellData.data[0]
    }, [spellData])

    useEffect(() => {
        if (!tab || !tab.name) return

        loadSpell({
            spellName: tab.name.split('--')[0],
            projectId: config.projectId,
            id: tab.id,
        })
    }, [tab])

    useEffect(() => {
        if (!client) return
        (async () => {
            if (!client || !tab || !tab.name) return

            // make sure to pass the projectId to the service call
            await client.service('spell-runner').get(tab.id,
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
                case 'chatwindow':
                    return <ChatWindow {...props} />
                default:
                    return <p></p>
            }
        }
    }

    return (
        <>
            <EventHandler tab={tab} pubSub={pubSub} />
            <Layout json={tab.chatLayout} factory={factory(tab)} tab={tab} />
        </>
    )
}

const Wrapped = props => {
    return <Chatwindow {...props} />
}

export default React.memo(Wrapped, (prevProps, nextProps) => {
    return prevProps.tab.id !== nextProps.tab.id
})
