import Switch from '@mui/material/Switch'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import { useDispatch } from 'react-redux'
import { useEffect, useRef, useState } from 'react'
import Scrollbars from 'react-custom-scrollbars-2'
import Editor from '@monaco-editor/react'

import { Window } from '@magickml/client-core'
import css from '../../../../screens/Magick/magick.module.css'
import SpeechUtils from '../../../../utils/speechUtils'
import { usePubSub } from '../../../../contexts/PubSubProvider'
import Avatar from './Avatar'
import { useAppSelector } from '../../../../state/hooks'
import {
  selectStateBytabId,
  upsertLocalState,
} from '../../../../state/localState'
import { Button } from '@magickml/client-core'

const AvatarWindow = ({ tab }) => {
  const scrollbars = useRef<any>()
  const [recording, setRecording] = useState<boolean>(false)
  const [file, setFile] = useState<string | null>(null)
  const [openData, setOpenData] = useState<boolean>(false)

  const dispatch = useDispatch()

  const localState = useAppSelector(state =>
    selectStateBytabId(state.localState, tab.id)
  )

  const { publish, subscribe, events } = usePubSub()
  const { $PLAYTEST_INPUT, $SEND_TO_AVATAR } = events

  const handleAvatarData = (event, data) => {
    if (data === file) return
    setFile(data)
  }

  useEffect(() => {
    return subscribe($SEND_TO_AVATAR(tab.id), handleAvatarData) as () => void
  }, [])

  const receiveData = data => {
    let toSend = data
    if (localState?.playtestData !== '{}') {
      const json = localState?.playtestData.replace(
        /(['"])?([a-z0-9A-Z_]+)(['"])?:/g,
        '"$2": '
      )

      // IMPLEMENT THIS: https://www.npmjs.com/package/json5

      // todo could throw an error here
      if (!json) return

      toSend = {
        input: data,
        ...JSON.parse(json),
      }
    }

    publish($PLAYTEST_INPUT(tab.id), toSend)
  }

  const options = {
    minimap: {
      enabled: false,
    },
    wordWrap: 'bounded' as 'bounded',
    fontSize: 14,
  }

  const handleEditorWillMount = monaco => {
    monaco.editor.defineTheme('sds-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#272727',
      },
    })
  }

  useEffect(() => {
    const speechUtils = SpeechUtils.getInstance()
    if (recording) speechUtils.initRecording(receiveData)
    if (!recording) speechUtils.stopRecording()
  }, [recording])

  const handleSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRecording(event.target.checked)
  }

  const onDataChange = dataText => {
    
    dispatch(upsertLocalState({ id: tab.id, playtestData: dataText }))
  }

  const toggleData = () => {
    setOpenData(!openData)
  }

  const pause = () => {
    setRecording(false)
  }

  const unpause = () => {
    setRecording(true)
  }

  const toolbar = (
    <>
      <FormGroup>
        <FormControlLabel
          control={<Switch checked={recording} onChange={handleSwitch} />}
          label="Record"
        />
      </FormGroup>
      <Button className="small" onClick={toggleData}>
        Data
      </Button>
    </>
  )

  return (
    <Window toolbar={toolbar}>
      <div
        className={css['playtest-output']}
        style={{ display: openData ? '' : 'none', height: '150px' }}
      >
        <Scrollbars ref={ref => (scrollbars.current = ref)}>
          <Editor
            theme="sds-dark"
            language="javascript"
            value={localState?.playtestData}
            options={options}
            defaultValue={localState?.playtestData || '{}'}
            onChange={onDataChange}
            beforeMount={handleEditorWillMount}
          />
        </Scrollbars>
      </div>
      <Avatar speechUrl={file} pause={pause} unpause={unpause} />
    </Window>
  )
}
export default AvatarWindow
