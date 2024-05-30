// DOCUMENTED
import { LoadingScreen } from 'client/core'
import { enqueueSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { useConfig } from '@magickml/providers'
import AgentWindow from './AgentWindow'
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

  // Handle data from initial loading of the agent data
  useEffect(() => {
    if (!agentData) return
    if (!agentData.data || !agentData.data[0]) return
    setData(agentData.data)
  }, [agentData])

  const [createNewAgent] = useCreateAgentMutation()

  /**
   * @description Load file and create an agent with its data.
   * @param {File} selectedFile The file containing agent data.
   */
  const loadFile = (selectedFile: File) => {
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
          (node: { data: { isPublic: any } }) => node?.data?.isPublic
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
    <AgentWindow data={data} onLoadFile={loadFile} />
  )
}

export default AgentManagerWindow
