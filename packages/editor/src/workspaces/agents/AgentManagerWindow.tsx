import React, { useEffect, useState } from 'react'
import { useConfig } from '../../contexts/ConfigProvider'
import AgentWindow from './NewAgentWindow'
import { useSnackbar } from 'notistack'
import axios from 'axios'

const AgentManagerWindow = () => {
  const config = useConfig()
  const [spellList, setSpellList] = useState<any[]>([])
  const [data, setData] = useState<Array<Object>>([])
  const { enqueueSnackbar } = useSnackbar()


  const resetData = async () => {
    const res = await fetch(`${config.apiUrl}/agents`)
    const json = await res.json()
    setData(json.data)
    console.log('res is', json)
  }

  const createNew = (
    data = { projectId: config.projectId, spells: [], name: 'My Agent' }
  ) => {
    if (!data.spells === undefined) data.spells = []
    // rewrite using fetch instead of axios
    axios({
      url: `${config.apiUrl}/agents`,
      method: 'POST',
      data: data,
    })
      .then(async res => {
        console.log('response is', res)
        const res2 = await fetch(`${config.apiUrl}/agents`)
        const json = await res2.json()
        setData(json.data)
      })
      .catch(err => {
        console.log('error is', err)
      })
  }

  const loadFile = selectedFile => {
    const fileReader = new FileReader()
    fileReader.readAsText(selectedFile)
    fileReader.onload = event => {
      const data = JSON.parse(event?.target?.result as string)
      createNew(data)
    }
  }

  const update = (_data: {}) => {
    console.log('Update called', _data)

    axios
      .patch(`${config.apiUrl}/agents/${'id'}`, _data)
      .then(res => {
        console.log('RESPONSE DATA', res.data)
        if (typeof res.data === 'string' && res.data === 'internal error') {
          enqueueSnackbar('internal error updating agent', {
            variant: 'error',
          })
        } else {
          enqueueSnackbar('updated agent', {
            variant: 'success',
          })
          console.log('response on update', JSON.parse(res.config.data))
          let responseData = res && JSON.parse(res?.config?.data)

          console.log('responseData', responseData)

          resetData()
        }
      })
      .catch(e => {
        console.log('ERROR', e)
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
    ;(async () => {
      const res = await fetch(`${config.apiUrl}/agents`)
      const json = await res.json()
      setData(json.data)
    })()
  }, [])



  return (
    <AgentWindow
      data={data}
      onDelete={handleDelete}
      onCreateAgent={createNew}
      update={update}
    />
  )
}

export default AgentManagerWindow
