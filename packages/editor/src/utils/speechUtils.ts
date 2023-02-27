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

class speechUtils {
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

  socket

  constructor() {
    this.socket = socketIOClient(
      import.meta.env.VITE_APP_SPEECH_SERVER_URL as string
    )
  }

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
      
      
    })

    this.socket.on('speechData', (data: any) => {
      const dataFinal = undefined || data.results[0].isFinal

      
      if (dataFinal === true) {
        let finalString = data.results[0].alternatives[0].transcript
        
        
        newMessageCallback(finalString)

        this.finalWord = true
        this.removeLastSentence = false
      }
    })
  }

  microphoneProcess = (e: any) => {
    const left = e.inputBuffer.getChannelData(0)
    const left16 = this.downsampleBuffer(left, 44100, 16000)
    this.socket.emit('binaryData', left16)
  }

  pause() {
    
    this.paused = true
  }

  unpause() {
    
    this.paused = false
  }

  stopRecording = () => {
    if (!this.streamStreaming) {
      return
    }

    this.streamStreaming = false
    this.socket.emit('endGoogleCloudStream', '')

    let track = this.globalStream.getTracks()[0]
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
