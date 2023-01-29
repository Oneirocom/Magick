import FileInput from '../../../screens/HomeScreen/components/FileInput'
import React, { useEffect, useState } from 'react'
import { magickApiRootUrl } from '../../../config'

import AgentWindow from './Agent'

const AgentManagerWindow = () => {
  const [data, setData] = useState(false)

  const resetData = async () => {
    const res = await fetch(
      `${magickApiRootUrl}/agents`
    )
    const json = await res.json();
    setData(null)
    console.log('res is', json)
  }

  const createNew = (data = { spells: [] }) => {
    console.log('data is', data)
    if(!data.spells === undefined) data.spells = []
    // rewrite using fetch instead of axios
    fetch(`${magickApiRootUrl}/agents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(async res => {
        console.log('response is', res)
        const res2 = await fetch(`${magickApiRootUrl}/agents`)
        const json = await res2.json();
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

  useEffect(() => {
    (async () => {
      const res = await fetch(`${magickApiRootUrl}/agents`)
      const json = await res.json();
      console.log('setting data to ', json)
      setData(json.data)
    })()
  }, [])

  return (
    <div className="agent-editor">
      <React.Fragment>
        {data &&
          (data as any).map((value, idx) => {
            return (
              <AgentWindow
                id={value.id ?? 0}
                key={value.id ?? idx}
                updateCallback={async () => {
                  resetData()
                }}
              />
            )
          })}
      </React.Fragment>
      <div className="entBtns">
        <button onClick={() => createNew()} style={{ marginRight: '10px' }}>
          Create New
        </button>
        <FileInput loadFile={loadFile} />
      </div>
    </div>
  )
}

export default AgentManagerWindow
