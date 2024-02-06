import { useSelector } from "react-redux"
import AgentDetails from "../agents/AgentWindow/AgentDetails"
import { RootState, useGetAgentByIdQuery } from "client/state"
import { useEffect, useState } from "react"

const ConfigWindow = () => {
  const [selectedAgent, setSelectedAgent] = useState(null)
  const { currentAgentId } = useSelector(
    (state: RootState) => state.globalConfig
  )
  const { data: agentData, isLoading } = useGetAgentByIdQuery({ agentId: currentAgentId }, {
    skip: !currentAgentId,
  })

  // Handle data from initial loading of the agent data
  useEffect(() => {
    if (!agentData || selectedAgent) return
    setSelectedAgent(agentData)
  }, [agentData])

  if (isLoading || !selectedAgent) return null

  // todo make this selected agent stuff internal to the component
  return (
    <div>
      <AgentDetails selectedAgentData={selectedAgent} setSelectedAgentData={setSelectedAgent} />
    </div>
  )
}

export default ConfigWindow