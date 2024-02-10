// DOCUMENTED

import { SPEECH_SERVER_URL } from 'clientConfig'
import socketIOClient from 'socket.io-client'

/**
 * Singleton class to manage speechUtils instances.
 */
export class Singleton {
  static instance: SpeechUtils

  /**
   * Get or create the speechUtils instance.
   * @returns {SpeechUtils} The speechUtils instance.
   */
  static getInstance(): SpeechUtils {
    if (!Singleton.instance) {
      Singleton.instance = new SpeechUtils()
    }

    return Singleton.instance
  }
}

/**
 * Class to handle speech recognition streaming using Google Cloud Speech-To-Text API.
 */
class SpeechUtils {
  bufferSize = 2048
  AudioContext: any
  context: any
  processor: any
  input: any
  globalStream: any

  finalWord = false
  removeLastSentence = true
  paused = false

  streamStreaming = false

  constraints = {
    audio: true,
    video: false,
  }

  socket: any

  constructor() {
    this.socket = socketIOClient(SPEECH_SERVER_URL as string)
  }

  /**
   * Initialize and start recording.
   * @param {Function} newMessageCallback - The callback function to handle received transcript.
   */
  initRecording = (newMessageCallback: Function) => {
    this.socket.emit('startGoogleCloudStream', '')
    this.streamStreaming = true
    this.AudioContext =
      window.AudioContext || (window as any).webkitAudioContext
    this.context = new AudioContext()
    this.processor = this.context.createScriptProcessor(this.bufferSize, 1, 1)
    this.processor.connect(this.context.destination)
    this.context.resume()

    const handleSuccess = (stream: any) => {
      this.globalStream = stream
      this.input = this.context.createMediaStreamSource(stream)
      this.input.connect(this.processor)

      this.processor.onaudioprocess = (e: any) => {
        if (this.paused) return

        this.microphoneProcess(e)
      }
    }

    navigator.mediaDevices.getUserMedia(this.constraints).then(handleSuccess)

    this.socket.on('connect', () => {
      this.socket.emit('join', 'connected')
    })

    this.socket.on('messages', (data: any) => {
      /* null */
    })

    this.socket.on('speechData', (data: any) => {
      const dataFinal = data.results[0]?.isFinal

      if (dataFinal === true) {
        const finalString = data.results[0].alternatives[0].transcript
        newMessageCallback(finalString)

        this.finalWord = true
        this.removeLastSentence = false
      }
    })
  }

  /**
   * Process microphone input and send data to the server.
   * @param {any} e - Audio event.
   */
  microphoneProcess = (e: any) => {
    const left = e.inputBuffer.getChannelData(0)
    const left16 = this.downsampleBuffer(left, 44100, 16000)
    this.socket.emit('binaryData', left16)
  }

  /**
   * Pause recording.
   */
  pause(): void {
    this.paused = true
  }

  /**
   * Unpause recording.
   */
  unpause(): void {
    this.paused = false
  }

  /**
   * Stop recording and close resources.
   */
  stopRecording = (): void => {
    if (!this.streamStreaming) {
      return
    }

    this.streamStreaming = false
    this.socket.emit('endGoogleCloudStream', '')

    const track = this.globalStream.getTracks()[0]
    track.stop()

    this.input.disconnect(this.processor)
    this.processor.disconnect(this.context.destination)
    this.context.close().then(() => {
      this.input = null
      this.processor = null
      this.context = null
      this.AudioContext = null
    })
    this.socket.off('speechData')
    this.socket.off('connect')
    this.socket.off('messages')
  }

  /**
   * Downsample the buffer.
   * @param {any} buffer - Original buffer.
   * @param {any} sampleRate - Original sample rate.
   * @param {any} outSampleRate - Desired output sample rate.
   * @returns {ArrayBuffer} - The downsampled buffer.
   */
  downsampleBuffer = (
    buffer: any,
    sampleRate: any,
    outSampleRate: any
  ): ArrayBuffer => {
    if (outSampleRate === sampleRate) {
      return buffer
    }
    if (outSampleRate > sampleRate) {
      throw 'Downsampling rate should be smaller than original sample rate'
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

export default Singleton
