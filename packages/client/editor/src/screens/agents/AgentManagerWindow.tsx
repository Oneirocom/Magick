// DOCUMENTED
import { LoadingScreen } from 'client/core'
import { type ClientPluginManager, pluginManager } from 'shared/core'
import { DEFAULT_USER_TOKEN, PRODUCTION, STANDALONE } from 'shared/config'
import { enqueueSnackbar, useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useConfig, useTreeData } from '@magickml/providers'
import AgentWindow from './AgentWindow'
import validateSpellData from './AgentWindow/spellValidator'
import { useCreateAgentMutation, useGetAgentsQuery } from 'client/state'

// todo - improve agent typing by pulling from feathers types
type AgentData = {
  id: string
}

/**
 * @description Main window representing the agent manager.
 */
const AgentManagerWindow = () => {
  const { data: agentData, isLoading } = useGetAgentsQuery({})

  const config = useConfig()
  const [data, setData] = useState<Array<AgentData>>([])
  const [enable, setEnable] = useState({})

  // Handle data from initial loading of the agent data
  useEffect(() => {
    if (!agentData) return
    if (!agentData.data || !agentData.data[0]) return
    setData(agentData.data)

    const spellAgent = agentData.data[0]?.rootSpell ?? {}
    const inputs = (pluginManager as ClientPluginManager).getInputByName()
    const plugin_list = (pluginManager as ClientPluginManager).getPlugins()
    for (const key of Object.keys(plugin_list)) {
      plugin_list[key] = validateSpellData(spellAgent, inputs[key])
    }
    setEnable(plugin_list)
  }, [agentData])


  const [createNewAgent] = useCreateAgentMutation()

  /**
   * @description Load file and create an agent with its data.
   * @param {File} selectedFile The file containing agent data.
   */
  const loadFile = selectedFile => {
    const fileReader = new FileReader()
    fileReader.readAsText(selectedFile)
    fileReader.onload = event => {
      const data = JSON.parse(event?.target?.result as string)
      data.projectId = config.projectId
      data.enabled = data?.enabled ? true : false
      data.updatedAt = new Date().toISOString()
      data.rootSpell = data?.rootSpell || {}
      data.secrets = JSON.stringify(
        Array.isArray(data?.secrets) ? data.secrets : []
      )
      // if the agent's public variable keys don't match the spell's public variable keys, update the agent
      if (!data.publicVariables && data?.rootSpell?.graph?.nodes) {
        data.publicVariables = data?.rootSpell?.graph?.nodes.filter(
          (node: { data }) => node?.data?.isPublic
        )
      }

      // Check if the "id" property exists in the object
      if (data.hasOwnProperty('id')) {
        delete data.id
      }
      createNewAgent(data)
        .unwrap()
        .then(() => {
          enqueueSnackbar('Agent created successfully!', {
            variant: 'success',
          })
        })
        .catch(() => {
          enqueueSnackbar('Error creating agent!', { variant: 'error' })
        })
    }
  }

  // Render the component.
  return isLoading ? (
    <LoadingScreen />
  ) : (
    <AgentWindow
      data={data}
      onLoadFile={loadFile}
      onLoadEnables={enable}
    />
  )
}

export default AgentManagerWindow
