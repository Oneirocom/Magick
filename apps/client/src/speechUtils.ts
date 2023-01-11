/* eslint-disable prefer-const */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-invalid-this */
import socketIOClient from 'socket.io-client'

export class singleton {
  static instance: speechUtils

  static getInstance() {
    if (!singleton.instance) {
      singleton.instance = new speechUtils()
    }

    return singleton.instance
  }
}
const kSampleRate = 16000
const kIntervalAudio_ms = 5000 // pass the recorded audio to the C++ instance at this rate

class speechUtils {
  context: AudioContext | null = null
  processor: any
  input: MediaRecorder | null = null
  globalStream: any

  finalWord = false
  removeLastSentence = true
  paused = false

  streamStreaming = false

  constraints = {
    audio: true,
    video: false,
  }

  socket

  constructor() {
    this.socket = socketIOClient(
      import.meta.env.VITE_APP_SPEECH_SERVER_URL as string
    )
  }

  initRecording = (newMessageCallback: Function) => {
    console.log('init recording')
    this.socket.emit('startWhisperStream', '')
    this.streamStreaming = true

    this.context = new AudioContext({
      sampleRate: kSampleRate,
      channelCount: 1,
      echoCancellation: false,
      autoGainControl: true,
      noiseSuppression: true,
    } as any)
    // this.processor = this.context.createScriptProcessor(this.bufferSize, 1, 1)
    // this.processor.connect(this.context.destination)
    this.context.resume()
    const chunks: Blob[] = []
    let freshAudio: Float32Array | null
    let pastLength = 0

    const handleSuccess = (stream: any) => {
      this.globalStream = stream
      // this.input = this.context?.createMediaStreamSource(stream)

      this.input = new MediaRecorder(stream)

      // this.input.connect(this.processor)

      this.input.ondataavailable = (e: BlobEvent) => {
        chunks.push(e.data)
        const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' })
        const fileReader = new FileReader()

        fileReader.onload = event => {
          const buf = new Uint8Array(fileReader.result as ArrayBuffer)
          if (!this.context) {
            return
          }
          this.context.decodeAudioData(
            buf.buffer,
            audioBuffer => {
              const offlineContext = new OfflineAudioContext(
                audioBuffer.numberOfChannels,
                audioBuffer.length,
                audioBuffer.sampleRate
              )
              const source = offlineContext.createBufferSource()
              source.buffer = audioBuffer
              source.connect(offlineContext.destination)
              source.start(0)

              offlineContext.startRendering().then(renderedBuffer => {
                freshAudio = renderedBuffer.getChannelData(0)

                //printTextarea('js: audio recorded, size: ' + audio.length + ', old size: ' + (audio0 == null ? 0 : audio0.length));

                // const audioAll = new Float32Array(
                //   oldAudio == null ? freshAudio.length : oldAudio.length + freshAudio.length
                // )
                // if (oldAudio != null) {
                //   audioAll.set(oldAudio, 0)
                // }

                const oldLength = pastLength
                console.log(
                  'oldLength',
                  oldLength,
                  'new length',
                  freshAudio.length
                )
                pastLength = freshAudio.length
                freshAudio = freshAudio.slice(oldLength)

                // audioAll.set(audio, oldAudio == null ? 0 : oldAudio.length)
                this.microphoneProcess(freshAudio)
              })
            },
            e => {
              console.log('error while decoding audio data', e)
              freshAudio = null
            }
          )
        }
        // if (this.paused) return
        // console.log('AUDIO PROCESS')
        // this.microphoneProcess(e)
        fileReader.readAsArrayBuffer(blob)
      }

      this.input?.start(kIntervalAudio_ms)
    }

    navigator.mediaDevices.getUserMedia(this.constraints).then(handleSuccess)

    this.socket.on('connect', () => {
      console.log('connected to speech server')
      this.socket.emit('join', 'connected')
    })

    this.socket.on('messages', (data: any) => {
      console.log('messages', data)
      console.log('messages: ', data)
    })
    this.socket.on('reconnect', () => {
      this.socket.emit('startWhisperStream')
    })

    this.socket.on('speechData', (data: any) => {
      console.log('speechData', data)
      //   const dataFinal = undefined || data.results[0].isFinal

      //   console.log('Speech data', data)
      //   if (dataFinal === true) {
      //     let finalString = data.results[0].alternatives[0].transcript
      //     console.log("Google Speech sent 'final' Sentence and it is:")
      //     console.log(finalString)
      //     newMessageCallback(finalString)

      //     this.finalWord = true
      //     this.removeLastSentence = false
      //   }
    })
  }

  microphoneProcess = (audio: Float32Array) => {
    this.socket.emit('binaryData', audio)
  }

  pause() {
    console.log('RECORDING PAUSED')
    this.input?.stop()
    this.paused = true
  }

  unpause() {
    console.log('RECODING UNPAUSED')
    this.input?.start()

    this.paused = false
  }

  stopRecording = () => {
    if (!this.streamStreaming) {
      return
    }

    this.streamStreaming = false
    this.socket.emit('endWhisperStream', '')
    this.input?.stop()
    this.globalStream.getTracks().forEach(function (track) {
      track.stop()
    })
    this.context?.close().then(() => {
      this.input = null
      this.processor = null
      this.context = null
    })
    this.socket.off('speechData')
    this.socket.off('connect')
    this.socket.off('messages')
  }

  downsampleBuffer = (buffer: any, sampleRate: any, outSampleRate: any) => {
    if (outSampleRate == sampleRate) {
      return buffer
    }
    if (outSampleRate > sampleRate) {
      throw 'downsampling rate should be smaller than original sample rate'
    }
    const sampleRateRatio = sampleRate / outSampleRate
    const newLength = Math.round(buffer.length / sampleRateRatio)
    let result = new Int16Array(newLength)
    let offsetResult = 0
    let offsetBuffer = 0
    while (offsetResult < result.length) {
      const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio)
      let accum = 0,
        count = 0
      for (
        let i = offsetBuffer;
        i < nextOffsetBuffer && i < buffer.length;
        i++
      ) {
        accum += buffer[i]
        count++
      }

      result[offsetResult] = Math.min(1, accum / count) * 0x7fff
      offsetResult++
      offsetBuffer = nextOffsetBuffer
    }
    return result.buffer
  }
}

export default singleton
