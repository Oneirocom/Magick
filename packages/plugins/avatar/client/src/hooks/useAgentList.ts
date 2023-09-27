import { useEffect, useState } from 'react'
import { IGNORE_AUTH } from 'shared/config'
import { useConfig } from '@magickml/client-core'
import { useSelector } from 'react-redux'

export const useAgentList = () => {
  //todo  using any here for now until we find a better solution for sharing this without circular dependencies
  const globalConfig = useSelector((state: any) => state.globalConfig)
  const token = globalConfig?.token
  const config = useConfig()
  const [agentList, setAgentList] = useState<any[]>([])

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
