import React, { FC, useEffect, useState } from 'react'
import { debounce } from 'lodash'
import { Switch } from '@magickml/client-core'
export const UpstreetAgentWindow: FC<any> = props => {
  props = props.props
  const { selectedAgentData, setSelectedAgentData, update } = props
  const debouncedFunction = debounce((id, data) => update(id, data), 500)
  const [checked, setChecked] = useState(
    selectedAgentData.data?.upstreet_enabled
  )
  const [disable, setDisable] = useState(false)


  useEffect(() => {
    if (props.enable['UpstreetPlugin'] == false) {
      setChecked(false)
      setDisable(true)
    }
    if (props.enable['UpstreetPlugin'] == true) {
      setChecked(selectedAgentData.data?.upstreet_enabled)
      setDisable(false)
    }
  }, [props.enable, selectedAgentData])
  return (
    <>
      <div
        style={{
          backgroundColor: '#222',
          padding: '2em',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pointerEvents: disable ? 'none' : 'auto',
          opacity: disable ? 0.2 : 1,
        }}
      >
        <h3>Upstreet</h3>
        <div
          style={{
            display: 'flex',
            paddingTop: '1em',
          }}
        >
          <Switch
            label={null}
            checked={checked}
            onChange={e => {
              setChecked(!checked)
              debouncedFunction(selectedAgentData.id, {
                ...selectedAgentData,
                data: {
                  ...selectedAgentData.data,
                  upstreet_enabled: e.target.checked,
                },
              })

              setSelectedAgentData({
                ...selectedAgentData,
                data: {
                  ...selectedAgentData.data,
                  upstreet_enabled: e.target.checked,
                },
              })
            }}
            style={{ float: 'right' }}
          />
        </div>
      </div>
    </>
  )
}
