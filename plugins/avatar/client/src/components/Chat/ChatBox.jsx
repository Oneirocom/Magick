
import React, { useCallback, useEffect, useRef, useState } from "react"
import Chat from "./Chat"
import { useSelector } from 'react-redux'
import { useConfig } from '../../../../../../packages/editor/src/contexts/ConfigProvider'
import { IGNORE_AUTH } from '../../../../../../packages/core/shared/src'
import styles from "../../App.module.css"

export default function ChatBox() {
    const [micEnabled, setMicEnabled] = React.useState(false)
    const [speechRecognition, setSpeechRecognition] = React.useState(false)
    const [spellList, setSpellList] = React.useState([])

    const config = useConfig()
    const globalConfig = useSelector((state) => state.globalConfig)
    const token = globalConfig?.token
    const headers = IGNORE_AUTH ? {} : { Authorization: `Bearer ${token}` }

    useEffect(() => {
        (async () => {
            const res = await fetch(
                `${config.apiUrl}/spells?projectId=${config.projectId}`,
                { headers }
            )
            const json = await res.json()

            setSpellList(json.data)
        })()
    }, [])

    return (
        <div className={styles.container}>
            <div className={styles.chatContainer}>
                <div className={styles.scrollContainer}>
                    <div className={styles.spellSelectorContainer}>
                        <label className={styles.spellListTitle}>Root Spell</label>
                        <select
                            className={styles.spellSelector}
                            name="spellList"
                            id="spellList"
                        >
                            <option disabled value={'default'}>
                                Select Spell
                            </option>
                            {
                                spellList?.length > 0 &&
                                spellList.map((spell, idx) => {
                                    return (
                                        <option value={spell.name} key={idx}>
                                            {spell.name}
                                        </option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <Chat
                        micEnabled={micEnabled}
                        setMicEnabled={setMicEnabled}
                        speechRecognition={speechRecognition}
                        setSpeechRecognition={setSpeechRecognition}
                    />
                </div>
            </div>
        </div>
    )
}