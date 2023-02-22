import Editor from '@monaco-editor/react'
import { useState, useEffect, useRef } from 'react'

import Window from '../../../components/Window/Window'
import WindowMessage from '../../components/WindowMessage'

import '../../../screens/Magick/magick.module.css'
import { TextEditorData, useInspector } from '../../contexts/InspectorProvider'
import { RootState } from '../../../state/store'
import { useSelector } from 'react-redux'

const TextEditor = props => {
  const [code, setCodeState] = useState<string | undefined>(undefined)
  const [data, setData] = useState<TextEditorData | null>(null)
  // const [height, setHeight] = useState<number>()
  const [editorOptions, setEditorOptions] = useState<Record<string, any>>()
  const [language, setLanguage] = useState<string | undefined>(undefined)
  const codeRef = useRef<string>()
  const preferences = useSelector((state: RootState) => state.preferences)
  const openaiApiKey = JSON.parse(
    localStorage.getItem('openai-api-key') || '{}'
  ).apiKey
  const { textEditorData, saveTextEditor, inspectorData } = useInspector()

  // const bottomHeight = 50
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
    if (code === textEditorData.data && !code) return
    const delayDebounce = setTimeout(() => {
      save(code)
    }, 3000)

    return () => clearTimeout(delayDebounce)
  }, [code])

  useEffect(() => {
    const options = {
      lineNumbers: language === 'javascript',
      minimap: {
        enabled: false,
      },
      suggest: {
        preview: language === 'javascript',
      },
      wordWrap: 'bounded',

      // fontFamily: '"IBM Plex Mono", sans-serif !important',
    }

    setEditorOptions(options)
  }, [language])

  useEffect(() => {
    if (!textEditorData) return
    setData(textEditorData)
    setCode(textEditorData.data as string)

    if (textEditorData?.options?.language) {
      setLanguage(textEditorData.options.language)
    }
  }, [textEditorData])

  const save = code => {
    const update = {
      ...data,
      data: code,
    }
    setData(update)
    saveTextEditor(update)
  }

  const onSave = () => {
    save(codeRef.current)
  }

  const complete = async code => {
    // if openaiKey is not set, then we need to window.alert the user
    if (!openaiApiKey) {
      window.alert('You need to set your OpenAI API key in the settings window')
      return
    }

    // send a request to openai to complete the code using codex model
    const response = await fetch(
      'https://api.openai.com/v1/engines/code-davinci-002/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          prompt: code,
          max_tokens: 200,
          temperature: 0,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
          stop: ['<END>'],
        }),
      }
    )

    const json = await response.json()
    const completion = json.choices[0].text

    console.log('completion', completion)

    updateCode(code + completion)
  }

  const onComplete = () => {
    complete(codeRef.current)
  }

  const functionPromptJs = `function worker (inputs, data) {
    const { input1, input2 } = inputs
  return {
    output: input1 + input2
  }
}`

  const functionPromptPython = `def worker (inputs, data):
  return {
    output: inputs['input1'] + inputs['input2']
  }`

  const makeGeneratePrompt = (
    functionText,
    language = 'javascript',
    inputs = [],
    outputs = []
  ) => {
    let prompt =
`// The following is a function written in ${language}.

// Inputs: input1, input2
// Outputs: output
// Task: add the inputs together and return the output

${language === 'python' ? functionPromptPython : functionPromptJs}

// The following is a function written in ${language}.`

    const inputString = inputs
      .map(input => {
        // add a ', ' if not last in the array
        return `${input}` + (input !== inputs[inputs.length - 1] ? ', ' : '')
      })
      .join('')

    const outputString = outputs
      .map(output => {
        // add a ', ' if not last in the array
        return (
          `${output}` + (output !== outputs[outputs.length - 1] ? ', ' : '')
        )
      })
      .join('')

    if (inputs) {
      prompt = prompt + `\n// Inputs: ${inputString}`
    }

    if (outputs) {
      prompt = prompt + `\n// Outputs: ${outputString}`
    }

    prompt = prompt + `\n// Task: ${functionText}\n`

    prompt =
      prompt +
      '\n' +
      (language === 'python' ? 'def ' : 'function ') +
      'worker (inputs, data)' +
      (language === 'python' ? ':' : ' {')

    return prompt
  }

  const generate = async () => {
    if (!openaiApiKey) {
      window.alert('You need to set your OpenAI API key in the settings window')
      return
    }

    // window prompt the user for what they want their function to do
    const functionText = window.prompt('What should this node do?')
    if (functionText === '' || !functionText) return

    const prompt = makeGeneratePrompt(functionText, language)

    console.log('prompt is', prompt)

    const response = await fetch(
      'https://api.openai.com/v1/engines/code-davinci-002/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          prompt,
          max_tokens: 500,
          temperature: 0,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
          stop: ['// The'],
        }),
      }
    )

    const json = await response.json()
    console.log('response', json)

    const completion = json.choices[0].text

    const update = {
      ...data,
      data: prompt + completion,
    }
    setCode(prompt + completion)
  }

  const onGenerate = () => {
    generate()
  }

  const updateCode = rawCode => {
    const code = rawCode.replace('\r\n', '\n')
    setCode(code)
    const update = {
      ...data,
      data: code,
    }
    setData(update)
  }

  const setCode = update => {
    setCodeState(update)
    codeRef.current = update
  }

  const toolbar = (
    <>
      <div style={{ flex: 1, marginTop: 'var(--c1)' }}>
        {textEditorData?.name && textEditorData?.name + ' - ' + language}
      </div>
      <button onClick={onComplete}>COMPLETE</button>
      <button onClick={onGenerate}>GENERATE</button>
      <button onClick={onSave}>SAVE</button>
    </>
  )

  if (!textEditorData?.control)
    return <WindowMessage content="Component has no editable text" />

  return (
    <Window key={inspectorData?.nodeId} toolbar={toolbar}>
      <Editor
        theme="sds-dark"
        // height={height} // This seemed to have been causing issues.
        language={language}
        value={code}
        options={editorOptions}
        defaultValue={code}
        onChange={updateCode}
        beforeMount={handleEditorWillMount}
      />
    </Window>
  )
}

export default TextEditor
