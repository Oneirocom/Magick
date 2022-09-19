// @ts-nocheck
import FileInput from '@/screens/HomeScreen/components/FileInput'
import { useGetGreetingsQuery } from '@/state/api/greetings'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

import EntityWindow from './EntityWindow'

const EntityManagerWindow = () => {
  const { data: greetings } = useGetGreetingsQuery(true)
  const [data, setData] = useState(false)

  const resetData = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_ROOT_URL}/entities`
    )
    console.log('res is ', res)
    setData(res.data)
  }

  const createNew = (data = {}) => {
    console.log('Create new called')
    axios
      .post(`${process.env.REACT_APP_API_ROOT_URL}/entity`, { data })
      .then(async res => {
        console.log('response is', res)
        const res2 = await axios.get(
          `${process.env.REACT_APP_API_ROOT_URL}/entities`
        )
        setData(res2.data)
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
      const res = await axios.get(
        `${process.env.REACT_APP_API_ROOT_URL}/entities`
      )
      setData(res.data)
      console.log('set the data', res.data)
    })()
  }, [])

  return (
    <div className="agent-editor">
      <React.Fragment>
        <div>
          {data &&
            (data as any).map((value, idx) => {
              return (
                <EntityWindow
                  id={value.id ?? 0}
                  key={value.id ?? idx}
                  updateCallback={async () => {
                    resetData()
                  }}
                  greetings={greetings}
                />
              )
            })}
        </div>
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
