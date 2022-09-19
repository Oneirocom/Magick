import Editor from '@monaco-editor/react'
import jsonFormat from 'json-format'
import { useState, useEffect } from 'react'
import { useGetSpellQuery } from '../../../state/api/spells'
import Window from '../../../components/Window/Window'

import '../../../screens/Thoth/thoth.module.css'
import WindowMessage from '../../components/WindowMessage'
import { usePubSub } from '@/contexts/PubSubProvider'

import { RootState } from '@/state/store'
import { useSelector } from 'react-redux'
import { useAuth } from '@/contexts/AuthProvider'

const StateManager = ({ tab, ...props }) => {
  const { publish, events } = usePubSub()
  const { user } = useAuth()
  const preferences = useSelector((state: RootState) => state.preferences)
  const { data: spell } = useGetSpellQuery(
    {
      spellId: tab.spellId,
      userId: user?.id as string,
    },
    {
      skip: !tab.spellId,
    }
  )

  const [typing, setTyping] = useState<boolean>(false)
  const [code, setCode] = useState('{}')

  // const SAVE_SPELL_DIFF = events.$SAVE_SPELL_DIFF(tab.id)
  const SAVE_SPELL = events.$SAVE_SPELL(tab.id)

  const editorOptions = {
    lineNumbers: false,
    minimap: {
      enabled: false,
    },
    fontSize: 14,
    suggest: {
      preview: false,
    },
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

  // useEffect(() => {
  //   if (props?.node?.rect?.height)
  //     setHeight((props.node.rect.height - bottomHeight) as number)

  //   // this is to dynamically set the appriopriate height so that Monaco editor doesnt break flexbox when resizing
  //   props.node.setEventListener('resize', data => {
  //     setTimeout(() => setHeight(data.rect.height - bottomHeight), 0)
  //   })
  // }, [props.node])

  useEffect(() => {
    if (!typing) return

    const delayDebounceFn = setTimeout(() => {
      if (preferences.autoSave) {
        onSave()
      }
      setTyping(false)
    }, 5000)

    return () => clearTimeout(delayDebounceFn)
  }, [code])

  // update code when game state changes
  useEffect(() => {
    if (!spell?.gameState) return
    setCode(jsonFormat(spell.gameState))
  }, [spell])

  const onClear = () => {
    const reset = `{}`
    setCode(reset)
  }

  const onChange = code => {
    setTyping(true)
    setCode(code)
  }

  const onSave = async () => {
    try {
      const parsedState = JSON.parse(code)
      const spellUpdate = {
        ...spell,
        gameState: parsedState,
      }

      // publish(SAVE_SPELL_DIFF, spellUpdate)
      publish(SAVE_SPELL, spellUpdate)
    } catch (err) {
      console.log(err)
    }
  }

  const toolbar = (
    <>
      <button className="small" onClick={onSave}>
        Save
      </button>
      <button className="small" onClick={onClear}>
        Clear
      </button>
    </>
  )

  if (tab.type === 'module')
    return <WindowMessage content="Modules do not support game state" />

  return (
    <Window toolbar={toolbar}>
      <Editor
        theme="sds-dark"
        defaultLanguage="json"
        value={code}
        options={editorOptions}
        defaultValue={code}
        onChange={onChange}
        beforeMount={handleEditorWillMount}
      />
    </Window>
  )
}

export default StateManager
