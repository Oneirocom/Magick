import { useSelector } from 'react-redux'
import { AgentDetails } from './header/agent-details'
import { RootState, useGetAgentByIdQuery } from 'client/state'
import { useEffect, useState } from 'react'
import { ConfigCredentials } from './credentials/config-credentials'
import { ConfigEmbeddings } from './embedding/config-embeddings'

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
    <div className="h-dvh pt-10 pb-20 overflow-y-scroll px-24">
      <AgentDetails
        selectedAgentData={selectedAgent}
        setSelectedAgentData={setSelectedAgent}
      />
      <ConfigEmbeddings agentId={selectedAgent.id} />
      <ConfigCredentials agentId={selectedAgent.id} />
    </div>
  )
}
