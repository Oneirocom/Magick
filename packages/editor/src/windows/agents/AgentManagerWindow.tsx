// DOCUMENTED
import { LoadingScreen } from '@magickml/client-core'
import { DEFAULT_USER_TOKEN, PRODUCTION, pluginManager } from '@magickml/core'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useConfig } from '@magickml/client-core'
import AgentWindow from './AgentWindow'
import validateSpellData from './AgentWindow/spellValidator'

/**
 * @description Main window representing the agent manager.
 */
const AgentManagerWindow = () => {
  const config = useConfig()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [data, setData] = useState<Array<object>>([])
  const { enqueueSnackbar } = useSnackbar()
  const [selectedAgentData, setSelectedAgentData] = useState<any>(undefined)
  const [enable, setEnable] = useState({})
  const globalConfig = useSelector((state: any) => state.globalConfig)
  const token = globalConfig?.token

  /**
   * @description Reset the data and fetch the latest info from the server.
   */
  const resetData = async () => {
    setIsLoading(true)
    const res = await fetch(
      `${config.apiUrl}/agents?projectId=${config.projectId}`,
      {
        headers: PRODUCTION
          ? { Authorization: `Bearer ${token}` }
          : { Authorization: `Bearer ${DEFAULT_USER_TOKEN}` },
      }
    )
    const json = await res.json()
    setData(json.data)
    setIsLoading(false)
    if (!json.data || !json.data[0]) return
    const spellAgent = json.data[0]?.rootSpell ?? {}
    const inputs = pluginManager.getInputByName()
    const plugin_list = pluginManager.getPlugins()
    for (const key of Object.keys(plugin_list)) {
      plugin_list[key] = validateSpellData(spellAgent, inputs[key])
    }
    setEnable(plugin_list)
  }

  const updateData = async newData => {
    const index = data.findIndex(agent => agent.id === newData.id)
    // Create a new array with the updated object
    const updatedArray = [
      ...data.slice(0, index),
      newData,
      ...data.slice(index + 1),
    ]

    // Set the state with the updated array
    setData(updatedArray)
  }

  /**
   * @description Create a new agent with provided data.
   * @param {Object} data The data needed to create a new agent.
   */
  const createNew = (data: {
    projectId: string
    rootSpell: string
    enabled: true
    name: string
    updatedAt: string
    secrets: string
  }) => {
    if (!token && PRODUCTION) {
      enqueueSnackbar('You must be logged in to create an agent', {
        variant: 'error',
      })
      return
    }

    fetch(`${config.apiUrl}/agents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...data,
        updatedAt: new Date().toISOString(),
        pingedAt: new Date().toISOString(),
      }),
    })
      .then(async res => {
        const res2 = await fetch(
          `${config.apiUrl}/agents?projectId=${config.projectId}`,
          {
            headers: PRODUCTION
              ? { Authorization: `Bearer ${token}` }
              : { Authorization: `Bearer ${DEFAULT_USER_TOKEN}` },
          }
        )
        const json = await res2.json()
        setData(json.data)
      })
      .catch(err => {
        console.error('error is', err)
      })
  }

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
      createNew(data)
    }
  }

  /**
   * @description Update an agent with provided data.
   * @param {string} id The agent ID.
   * @param {any} _data The new data to update the agent.
   */
  const update = (id: string, _data: any) => {
    fetch(`${config.apiUrl}/agents/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ..._data,
        updatedAt: new Date().toISOString(),
      }),
    })
      .then(async res => {
        res = await res.json()
        if (typeof res === 'string' && res === 'internal error') {
          enqueueSnackbar('internal error updating agent', {
            variant: 'error',
          })
        } else {
          enqueueSnackbar('Updated agent', {
            variant: 'success',
          })
          resetData()
        }
      })
      .catch(e => {
        console.error('ERROR', e)
        enqueueSnackbar('internal error updating entity', {
          variant: 'error',
        })
      })
  }

  /**
   * @description Handle agent delete request.
   * @param {string} id The agent ID to delete.
   */
  const handleDelete = (id: string) => {
    fetch(`${config.apiUrl}/agents/` + id, {
      method: 'DELETE',
      headers: PRODUCTION
        ? { Authorization: `Bearer ${token}` }
        : { Authorization: `Bearer ${DEFAULT_USER_TOKEN}` },
    })
      .then(async res => {
        res = await res.json()
        // TODO: Handle internal error
        // if (res === 'internal error') {
        //   enqueueSnackbar('Server Error deleting agent with id: ' + id, {
        //     variant: 'error',
        //   })
        // } else {
        enqueueSnackbar('Agent with id: ' + id + ' deleted successfully', {
          variant: 'success',
        })
        // }
        if (selectedAgentData.id === id) setSelectedAgentData(undefined)
        resetData()
      })
      .catch(e => {
        enqueueSnackbar('Server Error deleting entity with id: ' + id, {
          variant: 'error',
        })
      })
  }

  // useEffect callbacks for handling initial render and fetching data.
  useEffect(() => {
    if (!config.apiUrl || isLoading) return
    setIsLoading(true)
    ;(async () => {
      const res = await fetch(
        `${config.apiUrl}/agents?projectId=${config.projectId}`,
        {
          headers: PRODUCTION
            ? { Authorization: `Bearer ${token}` }
            : { Authorization: `Bearer ${DEFAULT_USER_TOKEN}` },
        }
      )
      const json = await res.json()
      setData(json.data)
      setIsLoading(false)
    })()
  }, [config.apiUrl])

  useEffect(() => {
    ;(async () => {
      const res = await fetch(
        `${config.apiUrl}/agents?projectId=${config.projectId}`,
        {
          headers: PRODUCTION
            ? { Authorization: `Bearer ${token}` }
            : { Authorization: `Bearer ${DEFAULT_USER_TOKEN}` },
        }
      )
      const json = await res.json()
      if (!json.data || !json.data[0]) return
      const spellAgent = json.data[0]?.rootSpell ?? {}
      const inputs = pluginManager.getInputByName()
      const plugin_list = pluginManager.getPlugins()
      for (const key of Object.keys(plugin_list)) {
        plugin_list[key] = validateSpellData(spellAgent, inputs[key])
      }
      setEnable(plugin_list)
    })()
  }, [])

  // Render the component.
  return isLoading ? (
    <LoadingScreen />
  ) : (
    <AgentWindow
      data={data}
      onDelete={handleDelete}
      onCreateAgent={createNew}
      update={update}
      updateData={updateData}
      onLoadFile={loadFile}
      setSelectedAgentData={setSelectedAgentData}
      selectedAgentData={selectedAgentData}
      onLoadEnables={enable}
    />
  )
}

export default AgentManagerWindow
