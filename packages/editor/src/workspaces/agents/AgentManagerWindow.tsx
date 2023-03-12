import React, { useEffect, useState } from 'react'
import { useConfig } from '../../contexts/ConfigProvider'
import AgentWindow from './AgentWindow'
import { useSnackbar } from 'notistack'
import axios from 'axios'
import { LoadingScreen } from '@magickml/client-core'

const AgentManagerWindow = () => {
  const config = useConfig()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [data, setData] = useState<Array<object>>([])
  const { enqueueSnackbar } = useSnackbar()
  const [selectedAgent, setSelectedAgent] = useState<any>({id: null})
  const [root_spell, setRootSpell] = useState('default')

  const resetData = async () => {
    setIsLoading(true)
    const res = await fetch(`${config.apiUrl}/agents`)
    const json = await res.json()
    setData(json.data)
    setIsLoading(false)
    console.log('res is', json)
  }

  const createNew = (data: {
    projectId: string
    rootSpell: string
    spells: string
    enabled: true
    name: string
    updatedAt: string
    secrets: string
  }) => {
    // rewrite using fetch instead of axios
    axios({
      url: `${config.apiUrl}/agents`,
      method: 'POST',
      data: {...data, updatedAt: new Date().toISOString()},
    })
      .then(async res => {
        const res2 = await fetch(`${config.apiUrl}/agents`)
        const json = await res2.json()
        setData(json.data)
      })
      .catch(err => {
        console.error('error is', err)
      })
  }

  const loadFile = selectedFile => {
    const fileReader = new FileReader()
    fileReader.readAsText(selectedFile)
    fileReader.onload = event => {
      const data = JSON.parse(event?.target?.result as string)
      data.projectId = config.projectId
      data.enabled = data?.enabled ? true : false
      data.updatedAt = data?.updatedAt || ''
      data.rootSpell = data?.rootSpell || '{}'
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

  const update = (id: string, _data: object) => {
    axios
      .patch(`${config.apiUrl}/agents/${id}`, {..._data, updatedAt: new Date().toISOString()})
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

  const handleDelete = (id: string) => {
    axios
      .delete(`${config.apiUrl}/agents/` + id)
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
        if (selectedAgent.id === id) setSelectedAgent({ id: null})
        resetData()
      })
      .catch(e => {
        enqueueSnackbar('Server Error deleting entity with id: ' + id, {
          variant: 'error',
        })
      })
  }

  useEffect(() => {
    if (!config.apiUrl || isLoading) return
    setIsLoading(true)
    ;(async () => {
      const res = await fetch(`${config.apiUrl}/agents`)
      const json = await res.json()
      console.log('res data', json.data)
      setData(json.data)
      setIsLoading(false)
    })()
  }, [config.apiUrl])

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
      setSelectedAgent={setSelectedAgent}
      selectedAgent={selectedAgent}
      rootSpell={root_spell}
      setRootSpell={setRootSpell}
    />
  )
}

export default AgentManagerWindow
