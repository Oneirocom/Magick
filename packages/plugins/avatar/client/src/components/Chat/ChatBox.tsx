import Mic from '@mui/icons-material/Mic'
import MicOff from '@mui/icons-material/MicOff'
import React, { useCallback, useEffect, useState } from 'react'
import {
  SepiaSpeechRecognitionConfig,
  sepiaSpeechRecognitionInit,
} from 'sepia-speechrecognition-polyfill'
import styles from './Chat.module.css'
import { useLipSync } from '../../hooks/useLipSync'
import { useAgentList } from '../../hooks/useAgentList'
import { useZustand } from '../../store/useZustand'
import { usePubSub, useConfig, useFeathers } from '@magickml/providers'

const voices = {
  'Female 1': '1QnOliOAmerMUNuo2wXoH-YoainoSjZen',
  'Female 2': '132G6oD0HHPPn4t1H6IkYv18_F0UVLWgi',
  'Female 3': '1CdYZ2r52mtgJsFs88U0ZViMSnzpQ_HRp',
  'Male 1': '17MQWS6m6VKkiU9KWRNGbTemZ0fIBKm0O',
  'Male 2': '1AwNZizuEmCgmnpAlqGLXWh_mvTm6OLbM',
  'Male 3': '1TKFdmFLttjjzByj2fZW8J70ZHjR-RTwc',
  Robot: '1NwpxG6kQ5lxwjPyuZTR0M9qc_7bMqPUH',
}

// Constants

const messagesMaxCharacters = 20000

// Prune Messages Function

export async function pruneMessages(messages) {
  let currentSize = 0
  const newMessages: any[] = []

  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i]

    currentSize += message.length

    // Add up to N characters.
    if (currentSize < messagesMaxCharacters) newMessages.push(message)
    else break
  }

  // Reverse the array so that the newest messages are first.
  newMessages.reverse()

  return newMessages
}

const sessionId =
  localStorage.getItem('sessionId') ??
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15)

localStorage.setItem('sessionId', sessionId)

const config = new SepiaSpeechRecognitionConfig()

const defaultSpeaker = 'Speaker'

const SpeechRecognition =
  (window as any).webkitSpeechRecognition || sepiaSpeechRecognitionInit(config)

export default function ChatBox() {
  const [micEnabled, setMicEnabled] = useState(false)
  const [speechRecognition, setSpeechRecognition] = useState<
    typeof SpeechRecognition | null
  >(null)
  const { avatarVrm } = useZustand()
  const lipSync = useLipSync(avatarVrm)
  const agentList = useAgentList()
  const { publish, subscribe, events } = usePubSub()

  const { client } = useFeathers()

  const [currentAgent, setCurrentAgent] = useState<any>(null)

  useEffect(() => {
    if (currentAgent) return
    if (agentList?.length > 0) {
      setCurrentAgent(agentList[0])
    }
  }, [agentList])

  const [waitingForResponse, setWaitingForResponse] = React.useState(false)
  const config = useConfig()

  const { projectId } = config

  const name = 'Eliza'
  const voice = voices['Female 1']

  const [speaker, setSpeaker] = React.useState(
    localStorage.getItem('speaker') || defaultSpeaker
  )

  // on speaker changer, set local storage
  useEffect(() => {
    localStorage.setItem('speaker', speaker)
  }, [speaker])

  const [input, setInput] = React.useState('')

  const [messages, setMessages] = React.useState<any[]>([])
  const handleChange = async event => {
    event.preventDefault()
    setInput(event.target.value)
  }

  React.useEffect(() => {
    const msgBox = document.querySelector('#msgscroll')
    msgBox?.scrollTo(0, msgBox.scrollHeight)
  }, [messages])

  // if user presses ctrl c, clear the messages
  useEffect(() => {
    const handleKeyDown = event => {
      if (event.ctrlKey && event.key === 'c') {
        setMessages([])
        // spacebar
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const startSpeech = () => {
    speechRecognition.start()
    setMicEnabled(true)
  }

  const stopSpeech = () => {
    speechRecognition.stop()
    setMicEnabled(false)
  }

  useEffect(() => {
    // Focus back on input when the response is given
    if (!waitingForResponse) {
      document.getElementById('messageInput')?.focus()
    }
  }, [waitingForResponse])

  const handleSubmit = async event => {
    if (event.preventDefault) event.preventDefault()

    // Get the value of the input element
    const input = event.target.elements.message
    const value = input.value
    handleUserChatInput(value)
  }

  const printToConsole = useCallback(text => {
    setWaitingForResponse(false)
    setMessages(messages => [...messages, name + ': ' + text])
    try {
      // fetch the audio file from ttsEndpoint
      const ttsEndpoint = 'https://ai-voice.webaverse.ai/tts?s=' + text

      fetch(ttsEndpoint).then(async response => {
        const blob = await response.blob()

        // convert the blob to an array buffer
        const arrayBuffer = await blob.arrayBuffer()

        if (!lipSync) return

        lipSync.startFromAudioFile(arrayBuffer)
      })
    } catch (error) {
      console.error(error)
    }
  }, [])

  const { $PLAYTEST_PRINT, $RUN_SPELL, RUN_AGENT } = events

  const handleUserChatInput = async value => {
    if (!value || waitingForResponse) return
    // clear chat input
    setInput('')

    // add the message to the window
    setMessages(messages => [...messages, `${speaker}: ${value}`])

    const promptMessages = await pruneMessages(messages)
    promptMessages.push(`${speaker}: ${value}`)

    const toSend = {
      connector: 'Input - Default',
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
    }

    const data = {
      id: 'avatar',
      agentName: currentAgent ? currentAgent.name : 'lost agent name',
      projectId: config.projectId,
      sessionId,
      agentId: currentAgent ? currentAgent.id : 'lost agent id',
      inputs: {
        'Input - Default': toSend,
      },
      secrets: JSON.parse(localStorage.getItem('secrets') || '{}'),
    }

    publish(RUN_AGENT, data)
  }

  useEffect(() => {
    if (!client) return

    client.service('agents').on('result', result => {
      // right now this is a decent check to ensure the data is the right data.
      // May be able to do something better.
      if (result.sessionId !== sessionId) return
      // Would be good to use a different outpute here eventually.
      // Feels dirty to use the default output hard coded.
      const outputs = result.data.result
      const outputKeys = Object.keys(outputs)
      const output = result.data.result[outputKeys[0]]

      printToConsole(output)
    })
  }, [client])

  useEffect(() => {
    const unsubscribe = subscribe($PLAYTEST_PRINT('avatar'), printToConsole)

    // Return a cleanup function.
    return unsubscribe as () => void
  }, [subscribe, printToConsole, $PLAYTEST_PRINT])

  let hasSet = false
  useEffect(() => {
    if (!waitingForResponse) {
      if (speechRecognition || hasSet) return
      hasSet = true
      const speechTest = new SpeechRecognition({})
      setSpeechRecognition(speechTest)

      speechTest.onerror = e => console.error(e.error, e.message)
      speechTest.onresult = e => {
        const i = e.resultIndex

        if (e.results[i].isFinal) {
          handleUserChatInput(`${e.results[i][0].transcript}`)
          setWaitingForResponse(true)
        }
      }

      speechTest.interimResults = true
      speechTest.continuous = true
    }
  }, [])

  return (
    <div className={styles.chatContainer}>
      <div className={styles.scrollContainer}>
        <div className={styles.agentSelectorContainer}>
          <label className={styles.agentListTitle}>Agent</label>
          <select
            className={styles.agentSelector}
            name="agentList"
            id="agentList"
            defaultValue={currentAgent ? currentAgent.name : ''}
            onChange={e => {
              const newAgent = agentList?.find(agent => {
                if (agent.name === e.target.value) {
                  return agent
                }
              })

              newAgent && setCurrentAgent(newAgent)
            }}
          >
            {agentList?.map((agent, idx) => {
              return (
                <option value={agent.name} key={idx}>
                  {agent.name}
                </option>
              )
            })}
          </select>
        </div>
        <div className={styles['chatBox']}>
          <div className={styles['speaker']}>
            <label htmlFor="speaker">Your Name</label>
            <input
              type="text"
              name="speaker"
              defaultValue={speaker}
              onChange={e => setSpeaker(e.target.value)}
            />
          </div>

          <label>Conversation</label>
          <div id={'msgscroll'} className={styles['messages']}>
            {messages.map((message, index) => (
              <div key={index}>{message}</div>
            ))}
          </div>

          <form className={styles['send']} onSubmit={handleSubmit}>
            {/* Disabled until state error is fixed */}
            <button
              // type="icon"
              className={styles.mic}
              // size={32}
              onClick={() => (!micEnabled ? startSpeech() : stopSpeech())}
            >
              {!micEnabled ? <Mic /> : <MicOff />}
            </button>
            <input
              autoComplete="off"
              type="text"
              name="message"
              id="messageInput"
              value={input}
              onInput={handleChange}
              onChange={handleChange}
            // disabled={waitingForResponse}
            />
            <button
              // size={14}
              onSubmit={handleSubmit}
              className={styles.sendButton}
              type="submit"
            >
              Send
            </button>
            {/* add a microphone button that will allow the user to speak into the mic and have the text appear in the input field */}
            {/* on click, indicate with style that the mic is active */}
          </form>
        </div>
      </div>
    </div>
  )
}
