import io, { Socket } from 'socket.io-client'
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { API_ROOT_URL, SPEECH_SERVER_PORT } from '../config';

const SPEECH_SERVER_URL = `${API_ROOT_URL}:${SPEECH_SERVER_PORT}`

export class singleton {
  static instance: speechUtils
  static getInstance() {
    if (!singleton.instance) {
      singleton.instance = new speechUtils()
    }

    return singleton.instance
  }
}

class speechUtils {
  bufferSize = 2048
  AudioContext: {
    new(contextOptions?: AudioContextOptions | undefined): AudioContext;
    prototype: AudioContext;
  } | undefined
  context: AudioContext | undefined
  processor: ScriptProcessorNode | undefined
  input: MediaStreamAudioSourceNode | undefined
  globalStream: MediaStream | undefined

  finalWord = false
  removeLastSentence = true

  streamStreaming = false

  constraints = {
    audio: true,
    video: false,
  }

  socket?: Socket<DefaultEventsMap, DefaultEventsMap>

  constructor() {
    this.socket = io(SPEECH_SERVER_URL, {
      rejectUnauthorized: false,
      secure: true,
    })
    //console.log('init speech client:', this.socket.connected)
  }

  initRecording = () => {
    if (this.socket === undefined || !this.socket) {
      this.socket = io(SPEECH_SERVER_URL, {
        rejectUnauthorized: false,
        secure: true,
      })
    }

    this.socket.emit('startGoogleCloudStream', '')
    this.streamStreaming = true
    this.AudioContext = window.AudioContext
    const context = new AudioContext()
    this.context = context
    if (!this.context) { throw new Error('AudioContext not supported.') }
    this.processor = this.context.createScriptProcessor(this.bufferSize, 1, 1)
    this.processor.connect(this.context.destination)
    this.context.resume()

    const handleSuccess = (stream: MediaStream) => {
      if (!this.context) { throw new Error('AudioContext not supported.') }
      if (!this.processor) { throw new Error('ScriptProcessorNode not supported.') }
      this.globalStream = stream
      this.input = this.context.createMediaStreamSource(stream)
      this.input.connect(this.processor)

      this.processor.onaudioprocess = (e: AudioProcessingEvent) => {
        this.microphoneProcess(e)
      }
    }

    navigator.mediaDevices.getUserMedia(this.constraints).then(handleSuccess)
    console.log('init recording')

    this.socket.on('connect', () => {
      if (this.socket === undefined || !this.socket) { throw new Error('Socket not connected.') }
      this.socket.emit('join', 'connected')
    })

    this.socket.on('messages', (data: unknown) => {
      console.log('messages: ', data)
    })

    this.socket.on('speechData', async (data: {results?: {isFinal?: boolean}[]}) => {
      // TODO: handle gracefully?
      if(!data) throw new TypeError('No data received in speechData')
      if(!data.results) throw new TypeError('No results received in speechData')
      if(!data.results[0]) throw new TypeError('No results[0] received in speechData')
      const dataFinal = undefined || data.results[0].isFinal

      if (dataFinal === true) {
        // const finalString = data.results[0].alternatives[0].transcript
        console.log('Speech Recognition:', dataFinal)
        //ChatService.sendMessage(`!voice|${finalString}`)

        this.finalWord = true
        this.removeLastSentence = false
      }
    })
  }

  microphoneProcess = (e: AudioProcessingEvent) => {
    if (this.socket === undefined || !this.socket) {
      this.socket = io(SPEECH_SERVER_URL, {
        rejectUnauthorized: false,
        secure: true,
      })
    }

    const left = e.inputBuffer.getChannelData(0)
    const left16 = this.downsampleBuffer(left, 44100, 16000)
    this.socket.emit('binaryData', left16)
  }

  stopRecording = () => {
    if (!this.streamStreaming) {
      return
    }
    // TODO: handle gracefully?
    if (!this.processor) { throw new TypeError('ScriptProcessorNode not supported.') }
    if (!this.context) { throw new TypeError('AudioContext not supported.') }
    if (!this.input) { throw new TypeError('MediaStreamAudioSourceNode not supported.') }
    if (!this.globalStream) { throw new TypeError('MediaStream not supported.') }
    if (!this.socket) { throw new TypeError('Socket not supported.') }

    this.streamStreaming = false
    this.socket.emit('endGoogleCloudStream', '')

    const track = this.globalStream.getTracks()[0]
    track.stop()
    this.input.disconnect(this.processor)
    this.processor.disconnect(this.context.destination)
    this.context.close().then(() => {
      this.input = undefined
      this.processor = undefined
      this.context = undefined
      this.AudioContext = undefined
    })
    this.socket.disconnect()
    this.socket = undefined
  }

  downsampleBuffer = (buffer: Float32Array, sampleRate: number, outSampleRate: number) => {
    if (outSampleRate === sampleRate) {
      return buffer
    }
    if (outSampleRate > sampleRate) {
      return console.error('downsampling rate should be smaller than original sample rate')
    }
    const sampleRateRatio = sampleRate / outSampleRate
    const newLength = Math.round(buffer.length / sampleRateRatio)
    const result = new Int16Array(newLength)
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
