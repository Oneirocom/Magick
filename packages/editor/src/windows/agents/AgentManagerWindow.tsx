// DOCUMENTED 
import { LoadingScreen } from '@magickml/client-core'
import { IGNORE_AUTH, pluginManager } from '@magickml/engine'
import axios from 'axios'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useConfig } from '../../contexts/ConfigProvider'
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
  const [root_spell, setRootSpell] = useState('default')
  const [enable, setEnable] = useState('')
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
        headers: IGNORE_AUTH ? {} : { Authorization: `Bearer ${token}` },
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

  /**
   * @description Create a new agent with provided data.
   * @param {Object} data The data needed to create a new agent.
   */
  const createNew = (data: {
    projectId: string
    rootSpell: string
    spells: string
    enabled: true
    name: string
    updatedAt: string
    secrets: string
  }) => {
    if (!token && !IGNORE_AUTH) {
      enqueueSnackbar('You must be logged in to create an agent', {
        variant: 'error',
      })
      return
    }

    axios({
      url: `${config.apiUrl}/agents`,
      method: 'POST',
      data: {
        ...data,
        updatedAt: new Date().toISOString(),
        pingedAt: new Date().toISOString(),
      },
      headers: IGNORE_AUTH ? {} : { Authorization: `Bearer ${token}` },
    })
      .then(async res => {
        const res2 = await fetch(
          `${config.apiUrl}/agents?projectId=${config.projectId}`,
          {
            headers: IGNORE_AUTH ? {} : { Authorization: `Bearer ${token}` },
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
      data.spells = Array.isArray(data?.spells) ? data.spells : []
      data.secrets = JSON.stringify(
        Array.isArray(data?.secrets) ? data.secrets : []
      )
      // if the agent's public variable keys don't match the spell's public variable keys, update the agent
      data.publicVariables =
        data?.publicVariables ||
        JSON.stringify(
          Object.values(
            (data.rootSpell && data.rootSpell.graph.nodes) || {}
          ).filter((node: { data }) => node?.data?.isPublic)
        )

      // Check if the "id" property exists in the object
      // eslint-disable-next-line no-prototype-builtins
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
    axios
      .patch(
        `${config.apiUrl}/agents/${id}`,
        {
          ..._data,
          updatedAt: new Date().toISOString(),
        },
        { headers: IGNORE_AUTH ? {} : { Authorization: `Bearer ${token}` } }
      )
      .then(res => {
        if (typeof res.data === 'string' && res.data === 'internal error') {
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
    axios
      .delete(`${config.apiUrl}/agents/` + id, {
        headers: IGNORE_AUTH ? {} : { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        if (res.data === 'internal error') {
          enqueueSnackbar('Server Error deleting agent with id: ' + id, {
            variant: 'error',
          })
        } else {
          enqueueSnackbar('Agent with id: ' + id + ' deleted successfully', {
            variant: 'success',
          })
        }
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
          headers: IGNORE_AUTH ? {} : { Authorization: `Bearer ${token}` },
        }
      )
      const json = await res.json()
      console.log('res data', json.data)
      setData(json.data)
      setIsLoading(false)
    })()
  }, [config.apiUrl])

  useEffect(() => {
    ;(async () => {
      const res = await fetch(
        `${config.apiUrl}/agents?projectId=${config.projectId}`,
        {
          headers: IGNORE_AUTH ? {} : { Authorization: `Bearer ${token}` },
        }
      )
      const json = await res.json()
      console.log('res data', json.data)
      if (!json.data || !json.data[0]) return
      const spellAgent = json.data[0]?.rootSpell ?? {}
      const inputs = pluginManager.getInputByName()
      const plugin_list = pluginManager.getPlugins()
      for (const key of Object.keys(plugin_list)) {
        plugin_list[key] = validateSpellData(spellAgent, inputs[key])
      }
      console.log(plugin_list)
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
      updateCallBack={resetData}
      onLoadFile={loadFile}
      setSelectedAgentData={setSelectedAgentData}
      selectedAgentData={selectedAgentData}
      rootSpell={root_spell}
      setRootSpell={setRootSpell}
      onLoadEnables={enable}
    />
  )
}

export default AgentManagerWindow