// DOCUMENTED
import { SpeechClient } from '@google-cloud/speech'
import { Server } from 'socket.io'
import https from 'https'
import * as fs from 'fs'
import path from 'path'

import { SPEECH_SERVER_PORT, USSSL_SPEECH } from 'shared/config'

let speechClient: SpeechClient
const encoding = 'LINEAR16'
const sampleRateHertz = 16000
const languageCode = 'en-US'

// Speech Recognition request configuration
const request = {
  config: {
    encoding: encoding as any,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
    profanityFilter: false,
    enableWordTimeOffsets: true,
    enableAutomaticPunctuation: true,
  },
  interimResults: false,
}

/**
 * Initialize the speech server.
 * @param ignoreDotEnv - Whether to ignore dotenv settings.
 */
export async function initSpeechServer() {
  const PORT: number = Number(SPEECH_SERVER_PORT) || 65532
  let io

  // Create a secure or non-secure server based on the settings
  if (USSSL_SPEECH) {
    const server = https.createServer({
      key: fs.readFileSync(path.join(__dirname, './certs/key.pem')),
      cert: fs.readFileSync(path.join(__dirname, './certs/cert.pem')),
    })
    server.listen(PORT)
    io = new Server(server, {
      cors: { origin: '*', methods: ['GET', 'POST'] },
    })
  } else {
    io = new Server(PORT, {
      cors: { origin: '*', methods: ['GET', 'POST'] },
    })
  }

  // Initialize the speech client
  speechClient = new SpeechClient()

  // Socket.io connection event handler
  io.on('connection', function (client: any) {
    let recognizeStream: any = null

    client.on('join', function () {
      client.emit('messages', 'Client connected')
    })

    client.on('messages', function (data: any) {
      client.emit('broad', data)
    })

    client.on('startGoogleCloudStream', function () {
      startRecognitionStream(client)
    })

    client.on('endGoogleCloudStream', function () {
      stopRecognitionStream()
    })

    client.on('binaryData', function (data: any) {
      try {
        if (
          recognizeStream !== null &&
          recognizeStream !== undefined &&
          recognizeStream.destroyed === false
        ) {
          recognizeStream.write(data)
        }
      } catch (e) {
        console.error('error in binaryData :::: ', e)
      }
    })

    /**
     * Start the recognition stream.
     * @param client - Socket.io client.
     */
    function startRecognitionStream(client: any) {
      recognizeStream = speechClient
        .streamingRecognize(request)
        .on('error', err => {
          console.error(err)
        })
        .on('data', data => {
          client.emit('speechData', data)
          if (data.results[0] && data.results[0].isFinal) {
            stopRecognitionStream()
            startRecognitionStream(client)
          }
        })
    }

    /**
     * Stop the recognition stream.
     */
    function stopRecognitionStream() {
      if (recognizeStream) {
        recognizeStream.end()
      }
      recognizeStream = null
    }
  })
}
