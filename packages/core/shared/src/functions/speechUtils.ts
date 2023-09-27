// DOCUMENTED
import io, { Socket } from 'socket.io-client'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { API_ROOT_URL, SPEECH_SERVER_PORT } from 'shared/config'
const SPEECH_SERVER_URL = `${API_ROOT_URL}:${SPEECH_SERVER_PORT}`

/**
 * Singleton class to provide single instance of `speechUtils`.
 */
export class singleton {
  static instance: speechUtils

  /**
   * Returns the singleton instance of `speechUtils`, creating one if needed.
   * @returns {speechUtils} The singleton instance of `speechUtils`.
   */
  static getInstance() {
    if (!singleton.instance) {
      singleton.instance = new speechUtils()
    }

    return singleton.instance
  }
}

/**
 * Speech recognition utility class that provides methods for speech-to-text conversion using Google Cloud Speech API.
 */
class speechUtils {
  bufferSize = 2048
  AudioContext:
    | {
        new (contextOptions?: AudioContextOptions | undefined): AudioContext
        prototype: AudioContext
      }
    | undefined
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

  /**
   * Constructor, initializes the socket connection to the speech server.
   */
  constructor() {
    this.socket = io(SPEECH_SERVER_URL, {
      rejectUnauthorized: false,
      secure: true,
    })
  }

  /**
   * Initializes the recording by setting up the audio context, audio processing, and socket events.
   */
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
    if (!this.context) {
      throw new Error('AudioContext not supported.')
    }
    this.processor = this.context.createScriptProcessor(this.bufferSize, 1, 1)
    this.processor.connect(this.context.destination)
    this.context.resume()

    const handleSuccess = (stream: MediaStream) => {
      if (!this.context) {
        throw new Error('AudioContext not supported.')
      }
      if (!this.processor) {
        throw new Error('ScriptProcessorNode not supported.')
      }
      this.globalStream = stream
      this.input = this.context.createMediaStreamSource(stream)
      this.input.connect(this.processor)

      this.processor.onaudioprocess = (e: AudioProcessingEvent) => {
        this.microphoneProcess(e)
      }
    }

    navigator.mediaDevices.getUserMedia(this.constraints).then(handleSuccess)

    if (this.socket) {
      this.socket.on('connect', () => {
        this.socket?.emit('join', 'connected')
      })

      this.socket.on('messages', (data: unknown) => {
        console.log('messages: ', data)
      })

      this.socket.on(
        'speechData',
        async (data: { results?: { isFinal?: boolean }[] }) => {
          if (!data) throw new TypeError('No data received in speechData')
          if (!data.results)
            throw new TypeError('No results received in speechData')
          if (!data.results[0])
            throw new TypeError('No results[0] received in speechData')
          const dataFinal = undefined || data.results[0].isFinal

          if (dataFinal === true) {
            console.log('Speech Recognition:', dataFinal)
            this.finalWord = true
            this.removeLastSentence = false
          }
        }
      )
    }
  }

  /**
   * Processes the microphone input and sends the binary data to the socket.
   * @param {AudioProcessingEvent} e Audio processing event.
   */
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

  /**
   * Stops the stream and disconnects the socket.
   */
  stopRecording = () => {
    if (!this.streamStreaming) {
      return
    }

    if (
      !this.processor ||
      !this.context ||
      !this.input ||
      !this.globalStream ||
      !this.socket
    ) {
      throw new TypeError('Not all objects are supported.')
    }

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

  /**
   * Downsamples the input buffer.
   * @param {Float32Array} buffer The input buffer.
   * @param {number} sampleRate The original sample rate.
   * @param {number} outSampleRate The output sample rate.
   * @returns {ArrayBuffer} The downsampled buffer.
   */
  downsampleBuffer = (
    buffer: Float32Array,
    sampleRate: number,
    outSampleRate: number
  ) => {
    if (outSampleRate === sampleRate) {
      return buffer
    }
    if (outSampleRate > sampleRate) {
      return console.error(
        'downsampling rate should be smaller than original sample rate'
      )
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
