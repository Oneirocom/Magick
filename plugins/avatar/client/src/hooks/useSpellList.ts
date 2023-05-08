import { useEffect, useState } from 'react'
import { DEFAULT_USER_TOKEN, PRODUCTION } from '@magickml/core'
import { useConfig } from '@magickml/client-core'
import { useSelector } from 'react-redux'

export const useSpellList = () => {
  const globalConfig = useSelector(state => state.globalConfig)
  const token = globalConfig?.token
  const headers = PRODUCTION
    ? { Authorization: `Bearer ${token}` }
    : { Authorization: `Bearer ${DEFAULT_USER_TOKEN}` }
  const config = useConfig()
  const [spellList, setSpellList] = useState([])

  useEffect(() => {
    ;(async () => {
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
