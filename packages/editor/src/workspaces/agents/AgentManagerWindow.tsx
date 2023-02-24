import FileInput from '../../screens/HomeScreen/components/FileInput'
import React, { useEffect, useState } from 'react'
import { useConfig } from '../../contexts/ConfigProvider'

import AgentWindow from './Agent'
<<<<<<< HEAD
import Layout from './NewAgentWindow'
=======
import Button from '../../components/Button'
>>>>>>> 949dc8c84f9d7ca0c1ab98879b34058b6af711b3

const AgentManagerWindow = () => {
  const config = useConfig()

  const [data, setData] = useState<Record<string, unknown> | null>(null)

  const resetData = async () => {
    const res = await fetch(`${config.apiUrl}/agents`)
    const json = await res.json()
    setData(json.data)
    console.log('res is', json)
  }

  const createNew = (data = { projectId: config.projectId, spells: [] }) => {
    console.log('data is', data)
    if (!data.spells === undefined) data.spells = []
    // rewrite using fetch instead of axios
    fetch(`${config.apiUrl}/agents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
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

  useEffect(() => {
    ;(async () => {
      const res = await fetch(`${config.apiUrl}/agents`)
      const json = await res.json()
      console.log('setting data to ', json)
      setData(json.data)
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
    <Layout />
  )
}

export default AgentManagerWindow
