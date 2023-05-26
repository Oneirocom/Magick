// DOCUMENTED
import { Button, Select, Window, useConfig } from '@magickml/client-core'
import Editor from '@monaco-editor/react'
import { useSnackbar } from 'notistack'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { useHotkeys } from 'react-hotkeys-hook'
import { useDispatch } from 'react-redux'
import { useEditor } from '../contexts/EditorProvider'
import { useInspector } from '../contexts/InspectorProvider'
import { usePubSub } from '@magickml/client-core'
import css from '../screens/Magick/magick.module.css'
import { spellApi } from '../state/api/spells'
import { useAppSelector } from '../state/hooks'
import {
  addLocalState,
  selectStateBytabId,
  upsertLocalState,
} from '../state/localState'

/**
 * Input component - Receives and sends playtest input.
 */
const Input = props => {
  const ref = useRef() as React.MutableRefObject<HTMLInputElement>

  // Trigger 'onSend' when 'return' key is pressed on the input.
  useHotkeys(
    'return',
    () => {
      console.log("HITTING ENTER!")
      if (ref.current !== document.activeElement) return
      props.onSend()
    },
    { enableOnFormTags: 'INPUT' as any },
    [props, ref]
  )

  return (
    <div className={css['playtest-input']}>
      <input
        ref={ref}
        type="text"
        value={props.value}
        onChange={props.onChange}
        placeholder="Type play test input here"
      ></input>
      <Button
        className="small"
        style={{ cursor: 'pointer' }}
        onClick={props.onSend}
      >
        Send
      </Button>
    </div>
  )
}

// Default playtest data.
const defaultPlaytestData = {
  sender: 'user',
  observer: 'assistant',
  type: 'playtest',
  client: 'playtest',
  channel: 'playtest',
  channelType: 'playtest',
  agentId: 'preview',
  entities: ['user', 'assistant'],
}

/**
 * Playtest component - The main component for handling playtesting functionality.
 */
const Playtest = ({ tab }) => {
  const config = useConfig()
  const { inspectorData } = useInspector()

  const scrollbars = useRef<any>()
  const [history, setHistory] = useState([])
  const [value, setValue] = useState('')
  const [openData, setOpenData] = useState<boolean>(false)

  const { publish, subscribe, events } = usePubSub()
  const dispatch = useDispatch()
  const { serialize } = useEditor()
  const { enqueueSnackbar } = useSnackbar()
  const { data: spellData } = spellApi.useGetSpellByIdQuery(
    {
      spellName: tab.name.split('--')[0],
      id: tab.id,
      projectId: config.projectId,
    },
    {
      refetchOnMountOrArgChange: true,
      skip: !tab.name.split('--')[0],
    }
  )

  const localState = useAppSelector(state => {
    return selectStateBytabId(state.localState, tab.id)
  })

  const { $PLAYTEST_PRINT, $RUN_SPELL } = events

  // Print to console callback function.
  const printToConsole = useCallback(
    (_, _text) => {
      // check if _text is a string
      if (typeof _text !== 'string')
        return console.warn('could not split text, not a string', _text)
      const text = `Agent: ` + _text?.split('\n')
      const newHistory = [...history, text]
      setHistory(newHistory as [])
    },
    [history]
  )

  // Set playtest options based on spell graph nodes with the playtestToggle set to true.
  const [playtestOptions, setPlaytestOptions] = useState<Record<
    string,
    any
  > | null>([])
  const [playtestOption, setPlaytestOption] = useState(null)

  useEffect(() => {
    if (!inspectorData || inspectorData.name !== 'Input') return
    setPlaytestOption(
      `Input - ` +
      (inspectorData.data.inputType &&
        inspectorData.data.inputType !== 'Default'
        ? inspectorData.data.inputType
        : inspectorData.data.inputName)
    )
  }, [inspectorData])

  useEffect(() => {
    if (!spellData || spellData.data.length === 0 || !spellData.data[0].graph)
      return

    const graph = spellData.data[0].graph
    const options = Object.values(graph.nodes)
      .filter((node: any) => {
        return node.data.isInput
      })
      .map((node: any) => ({
        value: node.data.name ?? node.name,
        label: node.data.name ?? node.name,
      }))

    setPlaytestOptions(options)
    if (!playtestOption) setPlaytestOption(options[0].value)
  }, [spellData])

  // Keep scrollbar at the bottom of its window.
  useEffect(() => {
    if (!scrollbars.current) return
    scrollbars.current.scrollToBottom()
  }, [history])

  useEffect(() => {
    const unsubscribe = subscribe($PLAYTEST_PRINT(tab.id), printToConsole)

    // Return a cleanup function.
    return unsubscribe as () => void
  }, [subscribe, printToConsole, $PLAYTEST_PRINT, tab.id])

  // Sync up localState into data field for persistence.
  useEffect(() => {
    // Set up a default for the local state here.
    if (!localState) {
      dispatch(
        addLocalState({
          id: tab.id,
          playtestData: JSON.stringify({
            ...defaultPlaytestData,
            projectId: config.projectId,
          }),
        })
      )
      return
    }
  }, [config.projectId, dispatch, localState, tab.id])

  // Available editor options.
  const options = {
    minimap: {
      enabled: false,
    },
    wordWrap: 'bounded' as const,
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

  // Send playtest input to the system.
  const onSend = async () => {
    const newHistory = [...history, `You: ${value}`]
    setHistory(newHistory as [])

    let toSend = value
    setValue('')

    const json = localState?.playtestData

    if (!json) {
      enqueueSnackbar('No data provided', {
        variant: 'error',
      })
      return
    }

    // Validate the JSON data.
    try {
      JSON.parse(json)
    } catch (e) {
      enqueueSnackbar('Invalid data - JSON is poorly formatted', {
        variant: 'error',
      })
      return
    }

    // Get spell from the editor.
    const graph = serialize()
    if (!graph) {
      enqueueSnackbar('No graph found', {
        variant: 'error',
      })
    }

    const playtestNode = Object.values(graph.nodes).find(node => {
      return node.data.name === playtestOption
    }) as any

    if (!playtestNode) {
      enqueueSnackbar('No input node found for this input type', {
        variant: 'error',
      })
      return
    }

    const playtestInputName = playtestNode?.data.name

    toSend = {
      connector: playtestInputName,
      content: value,
      sender: 'user',
      observer: 'assistant',
      agentId: 'preview',
      client: 'playtest',
      channel: 'previewChannel',
      projectId: config.projectId,
      channelType: 'previewChannelType',
      rawData: value,
      entities: ['user', 'assistant'],
      ...JSON.parse(json),
    }

    if (!playtestInputName) {
      enqueueSnackbar('No input node found for this input type', {
        variant: 'error',
      })
      return
    }

    const data = {
      spellName: tab.name.split('--')[0],
      id: tab.id,
      projectId: config.projectId,
      inputs: {
        [playtestInputName as string]: toSend,
      },
      publicVariables: JSON.stringify(
        Object.values(graph.nodes || {}).filter(
          (node: { data }) => node?.data?.isPublic
        )
      ),
      secrets: JSON.parse(localStorage.getItem('secrets') || '{}'),
    }

    publish($RUN_SPELL(tab.id), data)

    setValue('')
  }

  // Update state when playtest data is changed.
  const onDataChange = dataText => {
    dispatch(
      upsertLocalState({
        id: tab.id,
        playtestData: dataText ?? defaultPlaytestData,
      })
    )
  }

  const onChange = e => {
    setValue(e.target.value)
  }

  const onClear = () => {
    setHistory([])
  }

  const toggleData = () => {
    setOpenData(!openData)
  }

  const onSelectChange = async ({ value }) => {
    setPlaytestOption(value)
  }

  const toolbar = (
    <React.Fragment>
      <Select
        style={{ width: '100%', zIndex: 1 }}
        options={playtestOptions}
        onChange={onSelectChange}
        defaultValue={{
          value: playtestOption || null,
          label: playtestOption || 'No Inputs Found',
        }}
        placeholder="Select Input"
        creatable={false}
      />
      <Button className="small" style={{ cursor: 'pointer' }} onClick={onClear}>
        Clear
      </Button>
      <Button
        className="small"
        style={{ cursor: 'pointer' }}
        onClick={toggleData}
      >
        Data
      </Button>
    </React.Fragment>
  )

  if (document.getElementById('api-key')) {
    document
      .getElementById('api-key')
      ?.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
          event.preventDefault()
        }
      })
  }

  return (
    <Window toolbar={toolbar}>
      <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
        <div
          className={css['playtest-output']}
          style={{ display: openData ? '' : 'none' }}
        >
          <Scrollbars ref={ref => (scrollbars.current = ref)}>
            <Editor
              theme="sds-dark"
              language="json"
              value={localState?.playtestData}
              options={options}
              defaultValue={
                localState?.playtestData || JSON.stringify(defaultPlaytestData)
              }
              onChange={onDataChange}
              beforeMount={handleEditorWillMount}
            />
          </Scrollbars>
        </div>
        <div
          style={{
            height: 'var(--c1)',
            backgroundColor: 'var(--dark-3)',
            display: openData ? '' : 'none',
          }}
        ></div>
        <div className={css['playtest-output']}>
          <Scrollbars ref={ref => (scrollbars.current = ref)}>
            <ul>
              {history.map((printItem: string, key: any) => {
                return <li key={key}>{printItem}</li>
              })}
            </ul>
          </Scrollbars>
        </div>
        <label htmlFor="playtest-input" style={{ display: 'none' }}>
          Input
        </label>
        <Input onChange={onChange} value={value} onSend={onSend} />
      </div>
    </Window>
  )
}

export default Playtest
