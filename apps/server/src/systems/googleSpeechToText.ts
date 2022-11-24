import { SpeechClient } from '@google-cloud/speech'
import { Server } from 'socket.io'
import { config } from 'dotenv-flow'
import https from 'https'
import * as fs from 'fs'

config({ path: '.env' })

let speechClient: SpeechClient
const encoding = 'LINEAR16'
const sampleRateHertz = 16000
const languageCode = 'en-US'

const request = {
  config: {
    encoding: encoding as any,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
    profanityFilter: false,
    enableWordTimeOffsets: true,
    // speechContexts: [{
    //     phrases: ["hi","hello"]
    //    }]
  },
  interimResults: false,
}

export async function initSpeechServer(ignoreDotEnv: boolean) {
  if (ignoreDotEnv === false && process.env.ENABLE_SPEECH_SERVER === 'false') {
    console.log('Speech server disabled')
    return
  }

  const useSSL = process.env.USSSL_SPEECH === 'true'

  const PORT: number = Number(process.env.SPEECH_SERVER_PORT) || 65532
  let io

  if (useSSL) {
    const server = https.createServer({
      key: fs.readFileSync('certs/key.pem'),
      cert: fs.readFileSync('certs/cert.pem'),
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

  console.log('speech server started on port', PORT)

  speechClient = new SpeechClient()

  io.on('connection', function (client: any) {
    console.log('speech client connected')
    let recognizeStream: any = null

    client.on('join', function (data: any) {
      client.emit('messages', 'Client connected')
    })
    client.on('messages', function (data: any) {
      client.emit('broad', data)
    })

    client.on('startGoogleCloudStream', function (data: any) {
      startRecognitionStream(client)
    })
    client.on('endGoogleCloudStream', function (data: any) {
      stopRecognitionStream()
    })

    client.on('binaryData', function (data: any) {
      try {
        if (
          recognizeStream !== null &&
          recognizeStream !== undefined &&
          recognizeStream.destroyed === false
        ) {
          console.log('received data:', data)
          recognizeStream.write(data)
        }
      } catch (e) {
        console.log('error in binaryData :::: ', e)
      }
    })

    function startRecognitionStream(client: any) {
      recognizeStream = speechClient
        .streamingRecognize(request)
        .on('error', err => {
          console.log(err)
        })
        .on('data', data => {
          console.log('data :::: ', data)
          client.emit('speechData', data)
          if (data.results[0] && data.results[0].isFinal) {
            stopRecognitionStream()
            startRecognitionStream(client)
          }
        })
    }

    function stopRecognitionStream() {
      if (recognizeStream) {
        recognizeStream.end()
      }
      recognizeStream = null
    }
  })
}
