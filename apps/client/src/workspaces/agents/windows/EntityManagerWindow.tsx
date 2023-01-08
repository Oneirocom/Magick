import FileInput from '../../../screens/HomeScreen/components/FileInput'
import React, { useEffect, useState } from 'react'
import { magickApiRootUrl } from '../../../config'

import EntityWindow from './EntityWindow'

const EntityManagerWindow = () => {
  const [data, setData] = useState(false)

  const resetData = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_APP_API_ROOT_URL}/entities`
    )
    console.log('res is ', res)
    setData(await res.json())
  }

  const createNew = (data = {}) => {
    // rewrite using fetch instead of axios
    fetch(`${magickApiRootUrl}/entity`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    })
      .then(async res => {
        console.log('response is', res)
        const res2 = await fetch(`${magickApiRootUrl}/entities`)
        setData(await res2.json())
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
      const res = await fetch(`${magickApiRootUrl}/entities`)
      setData(await res.json())
    })()
  }, [])

  return (
    <div className="agent-editor">
      <React.Fragment>
        {data &&
          (data as any).map((value, idx) => {
            return (
              <EntityWindow
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

export default EntityManagerWindow
