export const functionPromptJs = `function worker (inputs, data) {
    const { input1, input2 } = inputs
      return {
        output: input1 + input2
      }
    }
    `

export const functionPromptPython = `def worker (inputs, data):
    return {
      output: inputs['input1'] + inputs['input2']
    }
    `

export const complete = async (code, openaiApiKey) => {
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

  return code + completion
}

export const generate = async (textEditorData, openaiApiKey) => {
  if (!openaiApiKey) {
    window.alert('You need to set your OpenAI API key in the settings window')
    return
  }

  // window prompt the user for what they want their function to do
  const functionText = window.prompt('What should this node do?')
  if (functionText === '' || !functionText) return

  const _inputs = []
  const _outputs = []

  // @ts-ignore
  inspectorData?.data?.inputs?.forEach((input: any) => {
    _inputs.push(input.socketKey)
  })

  // @ts-ignore
  inspectorData?.data?.outputs?.forEach((output: any) => {
    _outputs.push(output.socketKey)
  })

  const language = textEditorData?.options?.language

  const makeGeneratePrompt = (
    functionText,
    language = 'javascript',
    inputs = [],
    outputs = []
  ) => {
    let prompt =
      language === 'plaintext' || language === 'handlebars'
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
      language === 'plaintext' || language === 'handlebars'
        ? prompt
        : prompt + `\n// Task: ${functionText}\n`

    prompt =
      language === 'plaintext' || language === 'handlebars'
        ? prompt
        : prompt +
          '\n' +
          (language === 'python'
            ? 'def worker (inputs, data)'
            : `function worker ({${inputString}}, data)`) +
          (language === 'python' ? ':' : ' {')

    return prompt
  }

  const prompt = makeGeneratePrompt(functionText, language, _inputs, _outputs)

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

  const header =
    language === 'plaintext' || language === 'handlebars'
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

  const completion = json.choices[0].text

  return header + completion
}
