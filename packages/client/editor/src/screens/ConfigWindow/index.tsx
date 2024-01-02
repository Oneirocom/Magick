import { useSelector } from "react-redux"
import { type ClientPluginManager, pluginManager } from 'shared/core'
import AgentDetails from "../agents/AgentWindow/AgentDetails"
import { RootState, useGetAgentByIdQuery } from "client/state"
import { useEffect, useState } from "react"
import validateSpellData from "../agents/AgentWindow/spellValidator"

const ConfigWindow = () => {
  const [pluginList, setPluginList] = useState(null)
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

    const spellAgent = agentData.data.rootSpell ?? {}
    const inputs = (pluginManager as ClientPluginManager).getInputByName()
    const plugin_list = (pluginManager as ClientPluginManager).getPlugins()
    for (const key of Object.keys(plugin_list)) {
      plugin_list[key] = validateSpellData(spellAgent, inputs[key])
    }
    setPluginList(plugin_list)
    setSelectedAgent(agentData)
  }, [agentData])

  if (isLoading || !pluginList || !selectedAgent) return null

  // todo make this selected agent stuff internal to the component
  return (
    <div>
      <AgentDetails selectedAgentData={selectedAgent} onLoadEnables={pluginList} setSelectedAgentData={setSelectedAgent} />
    </div>
  )
}

export default ConfigWindow