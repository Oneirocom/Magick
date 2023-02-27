import React, { useEffect, useState } from 'react'
import { useConfig } from '../../contexts/ConfigProvider'
import AgentWindow from './NewAgentWindow'
import { useSnackbar } from 'notistack'
import axios from 'axios'
import { LoadingScreen } from '@magickml/client-core'

const AgentManagerWindow = () => {
  const config = useConfig()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [data, setData] = useState<Array<Object>>([])
  const { enqueueSnackbar } = useSnackbar()

  const resetData = async () => {
    setIsLoading(true)
    const res = await fetch(`${config.apiUrl}/agents`)
    const json = await res.json()
    setData(json.data)
    setIsLoading(false)
    console.log('res is', json)
  }

  const createNew = (
    data = {
      projectId: config.projectId,
      spells: [],
      dirty: true,
      enabled: true,
      name: 'My Agent',
      updated_at: '',
    }
  ) => {
    if (!data.spells === undefined) data.spells = []
    // rewrite using fetch instead of axios
    axios({
      url: `${config.apiUrl}/agents`,
      method: 'POST',
      data: data,
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
      data.dirty = data?.dirty ? data.dirty : false
      data.updated_at = data?.updated_at || ''
      data.spells = Array.isArray(data?.spells) ? data.spells : []

      // Check if the "id" property exists in the object
      if (data.hasOwnProperty('id')) {
        delete data.id
      }
      createNew(data)
    }
  }

  const update = (_data: {}) => {
    axios
      .patch(`${config.apiUrl}/agents/${'id'}`, _data)
      .then(res => {
        if (typeof res.data === 'string' && res.data === 'internal error') {
          enqueueSnackbar('internal error updating agent', {
            variant: 'error',
          })
        } else {
          enqueueSnackbar('updated agent', {
            variant: 'success',
          })
          
          const responseData = res && JSON.parse(res?.config?.data)

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
          enqueueSnackbar('Entity with id: ' + id + ' deleted successfully', {
            variant: 'success',
          })
        }
        resetData()
      })
      .catch(e => {
        enqueueSnackbar('Server Error deleting entity with id: ' + id, {
          variant: 'error',
        })
      })
  }

  useEffect(() => {
    if(!config.apiUrl || isLoading) return
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
    />
  )
}

export default AgentManagerWindow
