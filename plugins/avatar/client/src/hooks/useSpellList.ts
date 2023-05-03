import { useEffect, useState } from 'react'
import { IGNORE_AUTH } from '@magickml/core'
import { useConfig } from '@magickml/client-core'
import { useSelector } from 'react-redux'

export const useSpellList = () => {
    const globalConfig = useSelector((state) => state.globalConfig)
    const token = globalConfig?.token
    const headers = IGNORE_AUTH ? {} : { Authorization: `Bearer ${token}` }
    const config = useConfig()
    const [spellList, setSpellList] = useState([])

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

  return spellList
}