import Editor from '@monaco-editor/react'
import { useState, useEffect, useRef } from 'react'

import { Window } from '@magickml/client-core'
import { activeTabSelector, selectAllTabs } from '../../../state/tabs'

import '../../../screens/Magick/magick.module.css'
import { TextEditorData, useInspector } from '../../contexts/InspectorProvider'
import { RootState } from '../../../state/store'
import { useSelector } from 'react-redux'
import { Button } from '@magickml/client-core'

const TextEditor = props => {
  const [code, setCodeState] = useState<string | undefined>(undefined)
  const [data, setData] = useState<TextEditorData | null>(null)
  // const [height, setHeight] = useState<number>()
  const [editorOptions, setEditorOptions] = useState<Record<string, any>>()
  const [language, setLanguage] = useState<string | undefined>(undefined)
  const codeRef = useRef<string>()
  const openaiApiKey = JSON.parse(
    localStorage.getItem('openai-api-key') || '{}'
  ).apiKey
  const { textEditorData, saveTextEditor, inspectorData } = useInspector()
  const activeTab = useSelector(activeTabSelector)

  const [lastInputs, setLastInputs] = useState<string>('')

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
    console.log('focus')
    console.log('textEditorData', textEditorData)
    console.log('inspectorData', inspectorData)
    if (!inspectorData?.data.inputs) return

    const stringifiedInputs = JSON.stringify(inspectorData?.data.inputs)

    // if inspectorData?.data.inputs is the same as lastInputs, then return
    if (stringifiedInputs === lastInputs) return
    setLastInputs(JSON.stringify(inspectorData?.data.inputs))

    const inputs: string[] = []
    inspectorData?.data.inputs?.forEach((input: any) => {
      inputs.push('  ' + input.socketKey + ',')
    })

    const textLines = code?.split('\n') ?? []
    // get the index of the first line that starts with function
    const startIndex = textLines.findIndex(line => line.startsWith('function'))
    // get the first line that starts with }
    const endIndex = textLines.findIndex(line => line.startsWith('}'))

    if (startIndex === -1 || endIndex === -1) return

    // remove the lines in textLines starting at StartIndex and ending at EndIndex
    // replace with the inputs
    textLines.splice(startIndex + 1, endIndex - startIndex - 1, ...inputs)

    // join the textLines array back into a string
    const updatedText = textLines.join('\n')
    textEditorData.data = updatedText
    setCode(updatedText)
  }, [activeTab])

  useEffect(() => {
    if (code === textEditorData?.data && !code) return
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
    console.log('props', props)
    if (
      !textEditorData ||
      Object.keys(textEditorData).length === 0 ||
      !textEditorData.data
    )
      return

    console.log('textEditorData', textEditorData)

    console.log('inspectorData', inspectorData)

    const inputs = []
    inspectorData?.data.inputs?.forEach((input: any) => {
      inputs.push('  ' + input.socketKey + ',')
    })

    const textLines = textEditorData.data.split('\n')
    // get the index of the first line that starts with function
    const startIndex =
      textLines.findIndex(line => line.startsWith('function')) + 1
    // get the first line that starts with }
    const endIndex = textLines.findIndex(line => line.startsWith('}')) - 1

    // remove the lines in textLines starting at StartIndex and ending at EndIndex
    // replace with the inputs
    textLines.splice(startIndex, endIndex - startIndex, ...inputs)

    // join the textLines array back into a string
    const updatedText = textLines.join('\n')

    textEditorData.data = updatedText

    setData(textEditorData)
    setCode(updatedText)

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
          stop: ['\n\n', '###'],
        }),
      }
    )

    const json = await response.json()
    const completion = json.choices[0].text

    console.log('completion', completion)

    updateCode(code + completion)
  }

  const onComplete = () => {
    console.log('codeRef.current', codeRef.current)
    complete(codeRef.current)
  }

  const functionPromptJs = `function worker (inputs, data) {
const { input1, input2 } = inputs
  return {
    output: input1 + input2
  }
}

`

  const functionPromptPython = `def worker (inputs, data):
return {
  output: inputs['input1'] + inputs['input2']
}

`

  const makeGeneratePrompt = (
    functionText,
    language = 'javascript',
    inputs = [],
    outputs = []
  ) => {
    let prompt =
      language === 'plaintext'
        ? functionText
        : `// The following is a function written in ${language}.

// Inputs: input1, input2
// Outputs: output
// Task: add the inputs together and return the output
###
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

    if (inputs.length > 0) {
      prompt = prompt + `\n// Inputs: ${inputString}`
    }

    if (outputs.length > 0) {
      prompt = prompt + `\n// Outputs: ${outputString}`
    }

    prompt =
      language === 'plaintext'
        ? prompt
        : prompt + `\n// Task: ${functionText}\n`

    prompt =
      language === 'plaintext'
        ? prompt
        : prompt +
          '\n' +
          (language === 'python'
            ? 'def worker (inputs, data)'
            : `function worker ({${inputString}}, data)`) +
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

    let _inputs = []
    let _outputs = []
    console.log('inspectorData', inspectorData)

    console.log('inspectorData.data', inspectorData?.data)

    // @ts-ignore
    inspectorData?.data?.inputs?.forEach((input: any) => {
      _inputs.push(input.socketKey)
    })

    // @ts-ignore
    inspectorData?.data?.outputs?.forEach((output: any) => {
      _outputs.push(output.socketKey)
    })

    const prompt = makeGeneratePrompt(functionText, language, _inputs, _outputs)

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
          stop: ['\n\n', '###'],
        }),
      }
    )

    const d = language === 'python' ? '# ' : '// '

    let header =
      language === 'plaintext'
        ? `Task: ${functionText}\n`
        : `${d}Task: ${functionText}
${d}Outputs: ${_outputs.join(', ')}
${
  language === 'python'
    ? 'def '
    : 'function ' +
      `worker ({\n` +
      _inputs.map(input => `  ${input},\n`).join('') +
      `}, data)` +
      (language === 'python' ? ':' : ' {') +
      '\n'
}`

    const json = await response.json()
    console.log('response', json)

    const completion = json.choices[0].text

    setCode(header + completion)
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
        {textEditorData?.name && textEditorData?.name}
      </div>
      <Button onClick={onComplete}>COMPLETE</Button>
      <Button onClick={onGenerate}>GENERATE</Button>
      <Button onClick={onSave}>SAVE</Button>
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
