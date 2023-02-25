import FileInput from '../../screens/HomeScreen/components/FileInput'
import React, { useEffect, useState } from 'react'
import { useConfig } from '../../contexts/ConfigProvider'
// import AgentWindow from './Agent'
import AgentWindow from './NewAgentWindow'
import Button from '../../components/Button'
import { useSnackbar } from 'notistack'
import axios from 'axios'

const AgentManagerWindow = () => {
  const config = useConfig()
  const [spellList, setSpellList] = useState<any[]>([])
  const [data, setData] = useState<Array<Object>>([])
  const { enqueueSnackbar } = useSnackbar()
  const [root_spell, setRootSpell] = useState('default')
  const selectedSpellPublicVars = Object.values(
    spellList?.find(spell => spell.name === root_spell)?.graph.nodes || {}
  ).filter(node => node?.data?.Public)

  const resetData = async () => {
    const res = await fetch(`${config.apiUrl}/agents`)
    const json = await res.json()
    setData(json.data)
    console.log('res is', json)
  }

  const createNew = (
    data = { projectId: config.projectId, spells: [], name: 'Discord' }
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

          // setEnabled(responseData.enabled)
          // setLoopEnabled(responseData.data.loop_enabled)
          // setLoopInterval(responseData.data.loop_interval)

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

  const handleDelete = (id: number) => {
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

  useEffect(() => {
    ;(async () => {
      const res = await fetch(
        `${config.apiUrl}/spells?projectId=${config.projectId}`
      )
      const json = await res.json()

      console.log('res', json)
      console.log('spellList', json)
      setSpellList(json.data)
    })()
  }, [])

  return (
    // <div className="agent-editor" style={{margin: "1em", width: "100%", height: "100%", overflow: "auto"}}>
    //   <div style={{maxWidth: "800px", marginBottom: "1em"}}>
    //   <p>Agents are running applications that live somewhere on the internet and continue to run as long as they are active.
    //   <br />If you'd like to use your spells out in the real world, create an agent, configure your preferred services and set your main spell as the root spell.</p>
    //   </div>
    //  <React.Fragment>
    //     {data &&
    //       (data as any).map((value, idx) => {
    //         return (
    //           <AgentWindow
    //             id={value.id ?? 0}
    //             key={idx}
    //             updateCallback={async () => {
    //               resetData()
    //             }}
    //           />
    //         )
    //       })}
    //   </React.Fragment>
    //   <div className="entBtns">
    //     <button onClick={() => createNew()} style={{ marginRight: '10px' }}>
    //       Create New
    //     </button>
    //     <FileInput loadFile={loadFile} />
    //   </div>
    // </div>
    <AgentWindow
      data={data}
      onDelete={handleDelete}
      onCreateAgent={createNew}
      selectedSpellVars={selectedSpellPublicVars}
      update={update}
    >
      <div className="form-item agent-select">
        <span className="form-item-label">Root Spell</span>
        <select
          name="root_spell"
          id="root_spell"
          value={root_spell}
          onChange={event => {
            setRootSpell(event.target.value)
          }}
        >
          <option disabled value="default" key={0}>
            Select Spell
          </option>
          {spellList?.length > 0 &&
            spellList.map((spell, idx) => (
              <option value={spell.name} key={idx}>
                {spell.name}
              </option>
            ))}
        </select>
      </div>
    </AgentWindow>
  )
}

export default AgentManagerWindow
