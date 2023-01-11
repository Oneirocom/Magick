import { Server } from 'socket.io'

import https from 'https'
import * as fs from 'fs'
import path from 'path'
import whisperFactory from 'whisper.cpp'

export const initSpeechServer = async (ignoreDotEnv: boolean) => {
  const whisper = await whisperFactory()
  if (ignoreDotEnv === false && process.env.ENABLE_SPEECH_SERVER === 'false') {
    console.log('Speech server disabled')
    return
  }
  let instance
  const useSSL = process.env.USSSL_SPEECH === 'true'

  const PORT: number = Number(process.env.SPEECH_SERVER_PORT) || 65532
  let io: Server
  if (useSSL) {
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

  console.log('speech server started on port', PORT)

  io.on('connection', function (client: any) {
    console.log('speech client connected')

    client.on('join', function (data: any) {
      client.emit('messages', 'Client connected')
    })
    client.on('messages', function (data: any) {
      client.emit('broad', data)
    })

    client.on('startWhisperStream', function (data: any) {
      startRecognitionStream(client)
    })
    client.on('endWhisperStream', function (data: any) {
      stopRecognitionStream(client)
    })
    client.on('disconnect', () => {
      console.log('client disconnected...')
      stopRecognitionStream(client)
    })
    client.on('binaryData', function (data: Float32Array) {
      try {
        // const status = whisper.get_status()
        // if (status === 'loaded') {
        //   whisper.set_status('')
        // }
        // whisper.set_audio(1, data)
        const ret = whisper.full_default(data, 'en', false)
        console.log('whisper ret', ret)
        console.log('stdout', whisper.stdout)
        client.emit('speechData', ret)
      } catch (e) {
        console.log('error in binaryData :::: ', e)
      }
    })

    function startRecognitionStream(client: any) {
      console.log('initializing whisper...')

      const fname_model = path.resolve('assets/whisper.bin')
      if (!fs.existsSync(fname_model)) {
        console.error(
          'Error not found: please run `npm run download-whisper-bin` to use speech to text features'
        )
        return
      }
      if (!instance) {
        try {
          whisper.FS_unlink(fname_model)
        } catch (e) {
          // ignore
        }

        const model_data = fs.readFileSync(fname_model)
        if (model_data == null) {
          console.log('whisper: failed to read model file')
        }

        // write binary data to WASM memory
        whisper.FS_createDataFile('/', 'whisper.bin', model_data, true, true)

        // init the model

        const ret = whisper.init('whisper.bin')
        if (ret == false) {
          console.log('whisper: failed to init')
          return
        }
        instance = ret
        console.log('instance', ret)
      }
    }

    function stopRecognitionStream(client) {
      // console.log('stopping stream status is:', whisper.get_status())
      // whisper.free()
      // instance = null
    }
  })
}
