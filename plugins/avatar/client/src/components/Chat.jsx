import React, { useEffect } from "react"
import styles from "./Chat.module.css"
import Mic from '@mui/icons-material/Mic'
import MicOff from '@mui/icons-material/MicOff'

import {
  SepiaSpeechRecognitionConfig,
  sepiaSpeechRecognitionInit,
} from "sepia-speechrecognition-polyfill"

const voices = {
  "Female 1": "1QnOliOAmerMUNuo2wXoH-YoainoSjZen",
  "Female 2": "132G6oD0HHPPn4t1H6IkYv18_F0UVLWgi",
  "Female 3": "1CdYZ2r52mtgJsFs88U0ZViMSnzpQ_HRp",
  "Male 1": "17MQWS6m6VKkiU9KWRNGbTemZ0fIBKm0O",
  "Male 2": "1AwNZizuEmCgmnpAlqGLXWh_mvTm6OLbM",
  "Male 3": "1TKFdmFLttjjzByj2fZW8J70ZHjR-RTwc",
  Robot: "1NwpxG6kQ5lxwjPyuZTR0M9qc_7bMqPUH",
}

// Constants

const messagesMaxCharacters = 20000

// Prune Messages Function

export async function pruneMessages(messages) {
  let currentSize = 0
  const newMessages = []

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
  localStorage.getItem("sessionId") ??
  Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
localStorage.setItem("sessionId", sessionId)

const config = new SepiaSpeechRecognitionConfig()

const defaultSpeaker = "Speaker"

const SpeechRecognition =
  window.webkitSpeechRecognition || sepiaSpeechRecognitionInit(config)

export default function ChatBox({
  micEnabled,
  setMicEnabled,
  speechRecognition,
  setSpeechRecognition,
  lipSync,
}) {
  const [waitingForResponse, setWaitingForResponse] = React.useState(false)

  const name = "Eliza"
  const voice = voices["Female 1"]

  const [speaker, setSpeaker] = React.useState(
    localStorage.getItem("speaker") || defaultSpeaker,
  )

  // on speaker changer, set local storage
  useEffect(() => {
    localStorage.setItem("speaker", speaker)
  }, [speaker])

  // const { lipSync } = React.useContext(SceneContext)
  const [input, setInput] = React.useState("")

  const [messages, setMessages] = React.useState([])
  const handleChange = async (event) => {
    event.preventDefault()
    setInput(event.target.value)
  }

  React.useEffect(() => {
    const msgBox = document.querySelector("#msgscroll")
    msgBox.scrollTo(0, msgBox.scrollHeight)
  }, [messages])

  // if user presses ctrl c, clear the messages
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "c") {
        setMessages([])
        // spacebar
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
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
      document.getElementById("messageInput").focus()
    }
  }, [waitingForResponse])

  const handleSubmit = async (event) => {
    if (event.preventDefault) event.preventDefault()
    // Stop speech to text when a message is sent through the input
    stopSpeech()
    if (!waitingForResponse) {
      setWaitingForResponse(true)
      // Get the value of the input element
      const input = event.target.elements.message
      const value = input.value
      handleUserChatInput(value)
    }
  }

  const handleUserChatInput = async (value) => {
    if (value && !waitingForResponse) {
      // Send the message to the localhost endpoint
      const agent = name
      const spell_handler = "eliza3d"
      const projectId = "ok"

      //const newMessages = await pruneMessages(messages);

      // newMessages.push(`${speaker}: ${value}`)

      setInput("")
      setMessages((messages) => [...messages, `${speaker}: ${value}`])

      const promptMessages = await pruneMessages(messages)
      promptMessages.push(`${speaker}: ${value}`)
      const self = lipSync

      try {
        // const url = encodeURI(`https://magick.herokuapp.com/spells/${spell_handler}?projectId=${projectId}`)

        // axios.post(url).then((response) => {
        //   const output = response.data.choices[0].text
        // const ttsEndpoint =
        //   "https://voice.webaverse.com/tts?" +
        //   "s=" +
        //   output +
        //   "&voice=" +
        //   voices[voice]

        // fetch the audio file from ttsEndpoint
        const ttsEndpoint = "https://ai-voice.webaverse.ai/tts?s="+value

        fetch(ttsEndpoint).then(async (response) => {
          const blob = await response.blob()

          // convert the blob to an array buffer
          const arrayBuffer = await blob.arrayBuffer()

          self.startFromAudioFile(arrayBuffer)
          setMessages((messages) => [...messages, agent + ": " + value])
        })


        // fetch('http://localhost:3030/api', 
        // {  
        //   method: 'POST',  
        //   headers: { 'Content-Type': 'application/json',},  
        //   body: JSON.stringify({ 
        //     id: '727574f9-88fd-47f6-be39-a52493da8514',    
        //     apiKey: 'b2b14ea42a439cf138c55b450b9eddb5',    
        //     content: 'Hello World'  
        //   })
        // })

        setWaitingForResponse(false)
        // })
      } catch (error) {
        console.error(error)
      }
    }
  }

  let hasSet = false
  useEffect(() => {
    if (!waitingForResponse) {
      if (speechRecognition || hasSet) return
      hasSet = true
      const speechTest = new SpeechRecognition({})
      setSpeechRecognition(speechTest)

      speechTest.onerror = (e) => console.error(e.error, e.message)
      speechTest.onresult = (e) => {
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
    <div className={styles["chatBox"]}>
      <div className={styles["speaker"]}>
        <label htmlFor="speaker">Your Name</label>
        <input
          type="text"
          name="speaker"
          defaultValue={speaker}
          onChange={(e) => setSpeaker(e.target.value)}
        />
      </div>

      <label>Conversation</label>
      <div id={"msgscroll"} className={styles["messages"]}>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>

      <form
        className={styles["send"]}
        style={{ opacity: waitingForResponse ? "0.4" : "1" }}
        onSubmit={handleSubmit}
      >
        {/* Disabled until state error is fixed */}
        <button
          type="icon"
          className={styles.mic}
          size={32}
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
          disabled={waitingForResponse}
        />
        <button
          size={14}
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
  )
}
