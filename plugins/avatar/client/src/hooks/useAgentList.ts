import { useEffect, useState } from 'react'
import { IGNORE_AUTH } from '@magickml/core'
import { useConfig } from '@magickml/client-core'
import { useSelector } from 'react-redux'
import { RootState } from 'packages/editor/src/state/store'

export const useAgentList = () => {
  const globalConfig = useSelector((state: RootState) => state.globalConfig)
  const token = globalConfig?.token
  const config = useConfig()
  const [agentList, setAgentList] = useState([])

  useEffect(() => {
    ;(async () => {
      const res = await fetch(
        `${config.apiUrl}/agents?projectId=${config.projectId}`,
        {
          headers: IGNORE_AUTH ? {} : { Authorization: `Bearer ${token}` },
        }
      )
      const json = await res.json()

      setAgentList(json.data)
    })()
  }, [])

  return agentList
}
