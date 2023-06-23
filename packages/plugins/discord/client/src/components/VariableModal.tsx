import { Switch, Modal } from '@magickml/client-core'
import { useState } from 'react'

const VariableModal = ({
  selectedAgentData,
  editMode,
  testVoice,
  setEditMode,
  update,
}) => {
  const [state, setState] = useState({
    discord_api_key: selectedAgentData?.data?.discord_api_key,
    discord_starting_words: selectedAgentData?.data?.discord_starting_words,
    discord_bot_name: selectedAgentData?.data?.discord_bot_name,
    use_voice: selectedAgentData?.data?.use_voice,
    voice_provider: selectedAgentData?.data?.voice_provider,
    voice_character: selectedAgentData?.data?.voice_character,
    voice_language_code: selectedAgentData?.data?.voice_language_code,
    voice_endpoint: selectedAgentData?.data?.voice_endpoint,
  })

  const handleOnChange = e => {
    const { name, value } = e.target
    if (name === 'use_voice')
      setState({ ...state, [name]: e.target.checked ? 'on' : 'off' })
    else setState({ ...state, [name]: value })
  }

  const handleSave = () => {
    const data = {
      ...selectedAgentData,
      data: {
        ...selectedAgentData.data,
        ...state,
      },
    }

    update(selectedAgentData.id, data)
  }

  return (
    editMode && (
      <Modal open={editMode} onClose={setEditMode} handleAction={handleSave}>
        <div style={{ marginBottom: '1em' }}>
          <div>
            <span className="form-item-label">API Key</span>
            <input
              type="password"
              className="modal-element"
              name="discord_api_key"
              defaultValue={state.discord_api_key}
              onChange={handleOnChange}
            />
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <Switch
            label={'Voice Enabled'}
            checked={state.use_voice === 'on'}
            name="use_voice"
            onChange={handleOnChange}
          />
        </div>

        {state.use_voice === 'on' && (
          <>
            <div>
              <div style={{ marginBottom: '1em' }}>
                <div>
                  <span className="form-item-label">Voice Provider</span>
                  <select
                    name="voice_provider"
                    id="voice_provider"
                    className="select modal-element"
                    value={state.voice_provider ?? 'Google'}
                    onChange={handleOnChange}
                  >
                    <option value={'google'}>Google</option>
                    <option value={'tiktalknet'}>Tiktalknet</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: '1em' }}>
                <div>
                  <span className="form-item-label">Character</span>
                  {state.voice_provider === 'google' ? (
                    <select
                      className="select modal-element"
                      name="voice_character"
                      id="voice_character"
                      value={state.voice_character ?? 'en-US-Standard-A'}
                      onChange={handleOnChange}
                    >
                      <option value={'en-US-Standard-A'}>
                        en-US-Standard-A
                      </option>
                      <option value={'en-US-Standard-B'}>
                        en-US-Standard-B
                      </option>
                      <option value={'en-US-Standard-C'}>
                        en-US-Standard-C
                      </option>
                      <option value={'en-US-Standard-D'}>
                        en-US-Standard-D
                      </option>
                      <option value={'en-US-Standard-E'}>
                        en-US-Standard-E
                      </option>
                      <option value={'en-US-Standard-F'}>
                        en-US-Standard-F
                      </option>
                      <option value={'en-US-Standard-G'}>
                        en-US-Standard-G
                      </option>
                      <option value={'en-US-Standard-H'}>
                        en-US-Standard-H
                      </option>
                      <option value={'en-US-Standard-I'}>
                        en-US-Standard-I
                      </option>
                      <option value={'en-US-Standard-J'}>
                        en-US-Standard-J
                      </option>
                      <option value={'en-US-Wavenet-A'}>en-US-Wavenet-A</option>
                      <option value={'en-US-Wavenet-B'}>en-US-Wavenet-B</option>
                      <option value={'en-US-Wavenet-C'}>en-US-Wavenet-C</option>
                      <option value={'en-US-Wavenet-D'}>en-US-Wavenet-D</option>
                      <option value={'en-US-Wavenet-E'}>en-US-Wavenet-E</option>
                      <option value={'en-US-Wavenet-F'}>en-US-Wavenet-F</option>
                      <option value={'en-US-Wavenet-G'}>en-US-Wavenet-G</option>
                      <option value={'en-US-Wavenet-H'}>en-US-Wavenet-H</option>
                      <option value={'en-US-Wavenet-I'}>en-US-Wavenet-I</option>
                      <option value={'en-US-Wavenet-J'}>en-US-Wavenet-J</option>
                    </select>
                  ) : (
                    <select
                      name="voice_character"
                      id="voice_character"
                      className="select modal-element"
                      value={state.voice_character}
                      onChange={handleOnChange}
                    >
                      <option hidden></option>
                      <option value={'1_ztAbe5YArCMwyyQ_G9lUiz74ym5xJKC'}>
                        test voice 1
                      </option>
                      <option value={'1_ztAbe5YArCMwyyQ_G9lUiz74ym5xJKC'}>
                        text voice 2
                      </option>
                      <option value={'17PEym3KJs4mXLEjQC9kZvtG17plEcCM4'}>
                        jarad
                      </option>
                      <option value={'1QnOliOAmerMUNuo2wXoH-YoainoSjZen'}>
                        twilight sparkle
                      </option>
                    </select>
                  )}
                </div>
              </div>
              <div style={{ marginBottom: '1em' }}>
                <div>
                  <span className="form-item-label">Language Code</span>
                  <select
                    name="voice_language_code"
                    id="voice_language_code"
                    className="select modal-element"
                    value={state.voice_language_code ?? 'none'}
                    onChange={handleOnChange}
                  >
                    <option value={'en-US'}>none</option>
                    <option value={'en-GB'}>en-GB</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: '1em' }}>
                {state.voice_provider === 'tiktalknet' && (
                  <div>
                    <span className="form-item-label">Provider URL</span>
                    <input
                      type="text"
                      className="modal-element"
                      name="voice_endpoint"
                      defaultValue={state.voice_endpoint}
                      placeholder={'http://voice.metaverse.com/tts'}
                      onChange={handleOnChange}
                    />
                  </div>
                )}
              </div>
            </div>
            <div>
              <button
                onClick={() => testVoice()}
                style={{ marginRight: '10px', cursor: 'pointer' }}
              >
                Test
              </button>
            </div>
          </>
        )}
      </Modal>
    )
  )
}

export default VariableModal
