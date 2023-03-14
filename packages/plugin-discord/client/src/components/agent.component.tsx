import axios from 'axios'
import { useSnackbar } from 'notistack'
import React, { FC, useState } from 'react'
import { debounce } from 'lodash'

type PluginProps = {
  selectedAgentData: any
  props
}
import { API_ROOT_URL } from '@magickml/engine'
import { Switch } from '@magickml/client-core'
import VariableModal from './VariableModal'

export const DiscordAgentWindow: FC<any> = props => {
  props = props.props
  const { selectedAgentData, setSelectedAgentData, update } = props
  const debouncedFunction = debounce((id, data) => update(id, data), 500)
  const [editMode, setEditMode] = useState<boolean>(false)

  const { enqueueSnackbar } = useSnackbar()
  const [playingAudio, setPlayingAudio] = useState(false)

  const testVoice = async () => {
    if (
      (selectedAgentData.data?.voice_provider &&
        selectedAgentData.data?.voice_character) ||
      playingAudio
    ) {
      if (
        selectedAgentData.data?.voice_provider === 'tiktalknet' &&
        selectedAgentData.data?.tiktalknet_url?.length <= 0
      ) {
        return
      }

      const resp = await axios.get(`${API_ROOT_URL}/text_to_speech`, {
        params: {
          text: 'Hello there! How are you?',
          voice_provider: selectedAgentData.data?.voice_provider,
          voice_character: selectedAgentData.data?.voice_character,
          voice_language_code: selectedAgentData.data?.voice_language_code,
          tiktalknet_url: selectedAgentData.data?.tiktalknet_url,
        },
      })

      const url =
        selectedAgentData.data?.voice_provider === 'google' ||
        selectedAgentData.data?.voice_provider === 'tiktalknet'
          ? (import.meta as any).env.VITE_APP_FILE_SERVER_URL + '/' + resp.data
          : resp.data
      if (url && url.length > 0) {
        setPlayingAudio(true)
        console.log('url:', url)
        const audio = new Audio(url)
        audio.onended = function () {
          setPlayingAudio(false)
        }
        audio.play()
      }
    } else {
      enqueueSnackbar(
        'You need to setup the voice variables to test the voice or already playing another test',
        {
          variant: 'error',
        }
      )
    }
  }

  return (
    <>
      <div
        style={{
          backgroundColor: '#222',
          padding: '2em',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h3>Discord</h3>
        <div
          style={{
            display: 'flex',
            paddingTop: '1em',
          }}
        >
          <button
            onClick={() => {
              setEditMode(true)
            }}
            style={{ marginRight: '10px', cursor: 'pointer' }}
          >
            Edit
          </button>
          <Switch
            label={null}
            checked={selectedAgentData.data?.discord_enabled}
            onChange={e => {
              debouncedFunction(selectedAgentData.id, {
                data: {
                  ...selectedAgentData.data,
                  discord_enabled: e.target.checked,
                },
              })
            }}
            style={{ float: 'right' }}
          />
        </div>
      </div>
      {editMode && (
        <VariableModal
          selectedAgentData={selectedAgentData}
          testVoice={testVoice}
          editMode={editMode}
          setEditMode={setEditMode}
          update={update}
        />
      )}
    </>
  )
}
