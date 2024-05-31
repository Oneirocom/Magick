import { useSelector } from 'react-redux'
import { ConfigHeader } from './header/config-header'
import { RootState, useGetAgentByIdQuery } from 'client/state'
import { useEffect, useState } from 'react'
import { ConfigCredentials } from './credentials/config-credentials'

export const ConfigWindow = () => {
  const [selectedAgent, setSelectedAgent] = useState<any>(null)
  const { currentAgentId } = useSelector(
    (state: RootState) => state.globalConfig
  )
  const { data: agentData, isLoading } = useGetAgentByIdQuery(
    { agentId: currentAgentId },
    {
      skip: !currentAgentId,
    }
  )

  useEffect(() => {
    if (!agentData || selectedAgent) return
    setSelectedAgent(agentData)
  }, [agentData])

  if (isLoading || !selectedAgent) return null

  return (
    <div className="h-dvh pt-10 pb-20 overflow-y-scroll px-24 gap-y-10 flex flex-col">
      <ConfigHeader
        selectedAgentData={selectedAgent}
        setSelectedAgentData={setSelectedAgent}
      />
      <ConfigCredentials agentId={selectedAgent.id} />
    </div>
  )
}
