
import React, { useEffect, useState } from "react"
import Chat from "./Chat"
import { useLipSync } from "../../hooks/useLipSync"
import { useSpellList } from "../../hooks/useSpellList"
import { useZustand } from "../../store/useZustand"
import styles from "../../App.module.css"

export default function ChatBox() {
    const [micEnabled, setMicEnabled] = useState(false)
    const [speechRecognition, setSpeechRecognition] = useState(false)
    const { avatarVrm } = useZustand()
    const lipSync = useLipSync(avatarVrm);
    const spellList = useSpellList()

    return (
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
                    lipSync={lipSync}
                />
            </div>
        </div>
    )
}