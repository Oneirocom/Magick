import { useEffect, useState } from 'react'
import { DEFAULT_USER_TOKEN, STANDALONE } from '@magickml/core'
import { useConfig } from '@magickml/client-core'
import { useSelector } from 'react-redux'
import { RootState } from 'packages/editor/src/state/store'

export const useSpellList = () => {
  const globalConfig = useSelector((state: RootState) => state.globalConfig)
  const token = globalConfig?.token
  const headers = STANDALONE
    ? { Authorization: `Bearer ${DEFAULT_USER_TOKEN}` }
    : { Authorization: `Bearer ${token}` }
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
