import { useEffect, useState } from 'react'
import { DEFAULT_USER_TOKEN, STANDALONE } from 'shared/config'
import { useConfig } from 'client/core'
import { useSelector } from 'react-redux'

export const useSpellList = () => {
  // todo  using any here for now until we find a better solution for sharing this without circular dependencies
  const globalConfig = useSelector((state: any) => state.globalConfig)
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
